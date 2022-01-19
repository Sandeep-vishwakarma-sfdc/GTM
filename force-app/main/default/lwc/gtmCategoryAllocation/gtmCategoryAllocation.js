import { LightningElement,track,wire,api } from 'lwc';
import getCatergoryAllocation from '@salesforce/apex/GTMPathFinder.getCatergoryAllocation'
import getFiscalYear from '@salesforce/apex/GTMPathFinder.getFiscalYear'
import updateGTMDetail from '@salesforce/apex/GTMPathFinder.updateGTMDetailProductAllocation';
import getInstructions from '@salesforce/apex/GTMPathFinder.getInstructions';
import isWindowPeriodClosed from '@salesforce/apex/GTMPathFinder.isWindowPeriodClosed';
import All_Companies_Purchase_to_Customer from '@salesforce/label/c.All_Companies_Purchase_to_Customer';
import Customer_Lead_Customer from '@salesforce/label/c.Customer_Lead_Customer';
import Remaining from '@salesforce/label/c.Remaining';
import Check_If_Distribution_Is_Correct from '@salesforce/label/c.Check_If_Distribution_Is_Correct';
import Please_check_the_values_Not_matching_100 from '@salesforce/label/c.Please_check_the_values_Not_matching_100';
import Distribution_completed from '@salesforce/label/c.Distribution_completed';
import Instructions from '@salesforce/label/c.Instructions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GtmCategoryAllocation extends LightningElement {
    @track productAllocations = [];
    copyproductAllocationsVirtual = [];
    showLoading = false;
    disableAll = false;
    @track options = {
        notFilled:'0',
        inProgress:'0',
        completed:'0' 
    }
    sortDirection = true;
    @track paginatedProductCategoryAllocation = [];
    columns = [];
    fiscalYear = '';
    columnfiscalYear = '';

    labels = {
        All_Companies_Purchase_to_Customer1:All_Companies_Purchase_to_Customer.split('<br />')[0],
        All_Companies_Purchase_to_Customer2:All_Companies_Purchase_to_Customer.split('<br />')[1]+` ${this.fiscalYear.replace('-20','/')}`,
        Customer_Lead_Customer:Customer_Lead_Customer,
        Remaining:Remaining,
        Check_If_Distribution_Is_Correct:Check_If_Distribution_Is_Correct,
        Please_check_the_values_Not_matching_100:Please_check_the_values_Not_matching_100,
        Distribution_completed:Distribution_completed,
        Instructions:Instructions
    }

    @wire(getInstructions) getInstrustion({error,data}){
        if(data){
            this.instrustions = data.Instruction_Product_Category_Allocatio__c;
        }
    }

    @api onTabRefresh(){
        setTimeout(() => {
            this.connectedCallback();
        }, 500);
    }

    connectedCallback(){
        this.showLoading = true;
        Promise.all([getFiscalYear(),getCatergoryAllocation()]).then(result=>{
            this.fiscalYear = '';
            let data = [];
            let tempProductAllocation=[];
            let tempAllProductAllocations = [];
            if(result.length==2){
                this.fiscalYear = result[0];
                data = result[1]
            }
            for(let key in data){
                tempProductAllocation.push({key:key,value:data[key]})
            }
            tempProductAllocation.forEach(ele=>{
                let categoryObj = this.mapCustomerCategory(ele.value,ele.key)
                tempAllProductAllocations.push(categoryObj);
            });
            setTimeout(() => {
                this.productAllocations = tempAllProductAllocations;
                this.copyproductAllocationsVirtual = tempAllProductAllocations;
                this.paginatedProductCategoryAllocation = this.productAllocations;
                let copyProductAllocations = this.productAllocations;
                this.getTableData(copyProductAllocations);
                setTimeout(() => {
                    this.paginatedProductCategoryAllocation.forEach(ele=>{
                        this.updateStatus(ele.customerId);
                    })
                }, 200);
                this.updateStatusLabel();
            }, 200);
            setTimeout(() => {
                this.showLoading = false;
            }, 1500);
        }).catch(err=>{
            this.showLoading = false;
            console.log(err)
        });
        isWindowPeriodClosed().then(isDisable=>{
            this.disableAll = isDisable
        })
    }

    handleProductDetailChange(event){
        let detailId =  event.currentTarget.dataset.detail;
        let accid = event.currentTarget.dataset.accountid;
        let value = event.target.value
       

        this.template.querySelectorAll('[data-accountid="' + accid + '"]').forEach(col=>{
            if(col.classList.value.includes('percentage')){
                let remainingValue = Number(String(col.firstChild.data).replace('%',''));
                if((remainingValue - Number(value))<0){
                    //TODO: Add custom label for validation
                    this.showToast('Total Remaining Allocation','Total remaining allocations value must be positive','error');
                    value = '';
                }
            }
        });
        if(String(value).length==0 || (Number(value)<0 && Number(value)>=100)){// when inputs are Invalid
            this.template.querySelector('[data-detail="' + detailId + '"]').value = '';
            value = null;
        }
        if(Number(value)>=0 && Number(value)<=100){// when inputs are valid
        if(accid && value){
            this.updateGTMDetail(detailId,value);
            this.updateStatus(accid);
            this.onChangeLabelOption(value,accid,detailId);
            setTimeout(() => {
                this.updateStatusLabel();
            }, 200);
        }
        this.copyproductAllocationsVirtual.forEach(ele=>{
            ele.productCategory.forEach(e=>{
                if(e.GTMDetail==event.currentTarget.dataset.detail){
                    e.allocation = value;
                    this.updateStatus(event.currentTarget.dataset.accountid);
                }
            })
        })
        }
    }

    onChangeLabelOption(value,accid,detailId){
        this.productAllocations.forEach(ele=>{
            if(ele.customerId==accid){
                let percent = 100;
                let tempValue = value;
                ele.productCategory.forEach(e=>{
                    if(e.GTMDetail!=detailId){
                        tempValue = Number(e.allocation)+Number(tempValue);
                    }
                })
                percent = Number(percent) - Number(tempValue);
                let percentageLabel = '';
                if(percent==0){
                    percentageLabel = 'Completed';
                }else if(percent>0 && percent<100){
                    percentageLabel = 'In Progress';
                }else if(percent==100){
                    percentageLabel = 'Not Fill';
                }
                ele.percentage = percentageLabel;
                ele.percentageValue = percent;
            }
        })
    }
    
    updateGTMDetail(tempGtmId,tempValue){
        updateGTMDetail({gtmId:tempGtmId,value:tempValue}).then(value=>{
        }).catch(err=>console.log('Error while updating GTMDetails ',gtmId,' ',err))
    }

    getTableData(data){
        let year = this.fiscalYear.replace('-20','/');
        this.columnfiscalYear = `${this.labels.All_Companies_Purchase_to_Customer1} ${this.labels.All_Companies_Purchase_to_Customer2} ${year}`;
        if(data[0]){
        this.columns = data[0].productCategory;
        }
    }

    mapCustomerCategory(productAllocation,customerid){
        let masterObj = {};
        let arr = [];
        let percentage = 100 
        productAllocation.forEach(ele=>{
            if(ele.GTM_Customer__c == customerid){
            percentage = Number(percentage)-Number(ele.Product_Category_Allocation__c);
            let percentageLabel = '';
            if(percentage==0){
                percentageLabel = 'Completed';
            }else if(percentage>0 && percentage<100){
                percentageLabel = 'In Progress';
            }else if(percentage==100){
                percentageLabel = 'Not Fill';
            }
            console.log('percenatge ',percentage);
            let obj = {'pId':ele.Product_Category__r.Id,'pName':ele.Product_Category__r.Name,'GTMDetail':ele.Id,'allocation':ele.Product_Category_Allocation__c};
            arr.push(obj)
            masterObj = {customerId:ele.GTM_Customer__c,customerName:ele.GTM_Customer__r.Name,totalCompaniesPurches:ele.GTM_Details__r.Total_Purchase_of_Crop_Protection_PY__c, productCategory:arr,'isLeadCustomer':ele.GTM_Customer__r.Lead_Customer__c?true:false,percentage:percentageLabel,percentageValue:percentage,pathFinder:ele.GTM_Customer__r.Path_Finder__c};
            }
        })
        return masterObj;
    }

    handlePaginationAction(event){
        this.paginatedProductCategoryAllocation = event.detail.values;

        let copyProductAllocations = this.productAllocations;
                this.getTableData(copyProductAllocations);
                setTimeout(() => {
                    this.paginatedProductCategoryAllocation.forEach(ele=>{
                        this.updateStatus(ele.customerId);
                    })
                }, 200);
                this.updateStatusLabel();
    }
   
    handleFilterPanelAction(event){
        let filtersValue = JSON.parse(JSON.stringify(event.detail));
        this.applyFiltersOnCustomer(filtersValue);
    }
//searchStr,isLead,percentage
    applyFiltersOnCustomer(filtersValue){
        this.template.querySelector('c-pagination-cmp').pagevalue = 1;
        let search = filtersValue.search.length!=0;
        let filter1 = filtersValue.filter1.length!=0 && filtersValue.filter1!='Both';
        let filter2 = filtersValue.filter2.length!= 0 && filtersValue.filter2!='None';
        let filter3 = filtersValue.filter3.length!= 0 && filtersValue.filter3!='Both';
        let searchValue = String(filtersValue.search).toLocaleLowerCase();
        let filter1Value = filtersValue.filter1;
        if(filter1Value=='Lead Customer'){
            filter1Value = true;
        }
        if(filter1Value=='Non Lead Customer'){
            filter1Value = false;
        }
        let filter2Value = filtersValue.filter2;
        let filter3Value = filtersValue.filter3;
        this.getCalculatedPercentage();
        this.productAllocations = [];
        this.paginatedProductCategoryAllocation =[];
        this.productAllocations = this.copyproductAllocationsVirtual.filter(ele=>{
            let custName = String(ele.customerName).toLowerCase();
            if (search && filter1 && filter2 && filter3) {
                return custName.includes(searchValue) && ele.isLeadCustomer==filter1Value && ele.percentage==filter2Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && filter1 && filter2 && !filter3) {
               return custName.includes(searchValue) && ele.isLeadCustomer==filter1Value && ele.percentage==filter2Value
            }
            else if (search && filter1 && !filter2 && filter3) {
                return custName.includes(searchValue) && ele.isLeadCustomer==filter1Value  && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && filter1 && !filter2 && !filter3) {
                return custName.includes(searchValue) && ele.isLeadCustomer==filter1Value;
            }
            else if (search && !filter1 && filter2 && filter3) {
                return custName.includes(searchValue) && ele.percentage==filter2Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && !filter1 && filter2 && !filter3) {
                return custName.includes(searchValue)  && ele.percentage==filter2Value;
            }
            else if (search && !filter1 && !filter2 && filter3) {
                return custName.includes(searchValue) && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && !filter1 && !filter2 && !filter3) {
                return custName.includes(searchValue);
            }
            else if (!search && filter1 && filter2 && filter3) {
                return ele.isLeadCustomer==filter1Value && ele.percentage==filter2Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && filter1 && filter2 && !filter3) {
                return ele.isLeadCustomer==filter1Value && ele.percentage==filter2Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && filter1 && !filter2 && filter3) {
                return ele.isLeadCustomer == filter1Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && filter1 && !filter2 && !filter3) {
                return  ele.isLeadCustomer==filter1Value;
            }
            else if (!search && !filter1 && filter2 && filter3) {
                return ele.percentage==filter2Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && !filter1 && filter2 && !filter3) {
                return ele.percentage==filter2Value;
            }
            else if (!search && !filter1 && !filter2 && filter3) {
                return String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && !filter1 && !filter2 && !filter3) {
                return true;
            }
        });
        this.copyproductAllocationsVirtual.forEach(ele=>{
            this.updateStatus(ele.customerId);
        })
    //    console.log('search ', this.productAllocations.length);
       this.paginatedProductCategoryAllocation = JSON.parse(JSON.stringify(this.productAllocations));
    }

    getCalculatedPercentage(){
        this.copyproductAllocationsVirtual.forEach((ele)=>{
            let percentage = 100;
            ele.productCategory.forEach(e=>{
                percentage = Number(percentage) - Number(e.allocation); 
                // console.log('cal percenatge ',percentage);
            })
            let percentageLabel = '';
            if(percentage==0){
                percentageLabel = 'Completed';
            }else if(percentage>0 && percentage<100){
                percentageLabel = 'In Progress';
            }else if(percentage==100){
                percentageLabel = 'Not Fill';
            }
            setTimeout(() => {
                ele.percentage = percentageLabel;
                ele.percentageValue = percentage;
                // console.log('percentage label ',ele.percentage);
            }, 50);
        })
    }

    updateStatus(customerId){
        let inputCompleted = 100;
        setTimeout(() => {
        this.template.querySelectorAll('[data-accountid="' + customerId + '"]').forEach(col=>{
            //console.log('classes ',col.classList.value);
            if(col.classList.value.includes('inputDetails')){
                if(col.value){
                    inputCompleted = Number(inputCompleted) - Number(col.value);
                    // console.log('value ',col.value);
                }
            }
            if(col.classList.value.includes('percentage')){
                // console.log('percentage ',col);
                col.firstChild.data = `${Number(inputCompleted).toFixed(2)} %`;
            }
            if(col.classList.value.includes('distribution')){
                col.style.backgroundColor = 'green';
                col.style.color = '#fff';
                col.firstChild.data = this.labels.Distribution_completed;
            }
            if(col.classList.value.includes('distribution') && inputCompleted<=100 && inputCompleted!=0){
                col.style.backgroundColor = 'red';
                col.style.color = '#fff';
                col.firstChild.data = this.labels.Please_check_the_values_Not_matching_100;
            }
        })
    }, 200);
    }

    updateStatusLabel(){
        let green= 0;
        let red=0;
        let yellow=0;
        this.productAllocations.forEach(ele=>{
            if(ele.percentage=='Completed'){
                green++;
            }
            if(ele.percentage=='In Progress'){
                yellow++
            }
            if(ele.percentage=='Not Fill'){
                red++;
            }
        });

        this.options = {
            completed:green,
            inProgress:yellow,
            notFilled:red
        }
    }

    handleSort(event){
        let fieldName = event.target.name;
        this.sortDirection = !this.sortDirection;
        this.sortData(fieldName,this.sortDirection);
    }

    sortData(fieldname, direction) {
        direction = direction==true?'asc':'des';
        let parseData = JSON.parse(JSON.stringify(this.copyproductAllocationsVirtual));
        if(parseData.length>1){
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.productAllocations = parseData;
        }
    }

    showToast(title,message,variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}