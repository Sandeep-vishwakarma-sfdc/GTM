import { LightningElement,track,api,wire } from 'lwc';
import getCropAllocation from '@salesforce/apex/GTMPathFinder.getCropAllocation'
import getFiscalYear from '@salesforce/apex/GTMPathFinder.getFiscalYear'
import updateGTMDetail from '@salesforce/apex/GTMPathFinder.updateGTMDetailCropAllocation';
import getInstructions from '@salesforce/apex/GTMPathFinder.getInstructions';
import All_Companies_Purchase_to_Customer from '@salesforce/label/c.All_Companies_Purchase_to_Customer';
import Customer_Lead_Customer from '@salesforce/label/c.Customer_Lead_Customer';
import Remaining from '@salesforce/label/c.Remaining';
import Check_If_Distribution_Is_Correct from '@salesforce/label/c.Check_If_Distribution_Is_Correct';
export default class GtmCropAllocation extends LightningElement {
    instrustions = '';
    @track cropAllocations = [];
    copyCropAllocationsVirtual = [];
    showLoading = false;
    @track options = {
        notFilled:'0',
        inProgress:'0',
        completed:'0' 
    }
    sortDirection = true;
    @track paginatedCropAllocation = [];
    columns = [];
    fiscalYear = '';
    columnfiscalYear = '';

    @wire(getInstructions) getInstrustion({error,data}){
        if(data){
            this.instrustions = data.Instruction_Crop_Allocation__c;
        }
    }

    @api onTabRefresh(){
        setTimeout(() => {
            this.connectedCallback();
        }, 500);
    }
    labels = {
        All_Companies_Purchase_to_Customer1:All_Companies_Purchase_to_Customer.split('<br />')[0],
        All_Companies_Purchase_to_Customer2:All_Companies_Purchase_to_Customer.split('<br />')[1]+` ${this.fiscalYear.replace('-20','/')}`,
        Customer_Lead_Customer:Customer_Lead_Customer,
        Remaining:Remaining,
        Check_If_Distribution_Is_Correct:Check_If_Distribution_Is_Correct
    }

    connectedCallback(){
        Promise.all([getFiscalYear(),getCropAllocation()]).then(result=>{
            console.log('results ',result);
            let data = [];
            let tempCropAllocation=[];
            let tempAllCropAllocations = [];
            if(result.length==2){
                this.fiscalYear = result[0];
                data = result[1]
            }
            console.log('getCropAllocation',data);
            for(let key in data){
                tempCropAllocation.push({key:key,value:data[key]})
            }
            tempCropAllocation.forEach(ele=>{
                console.log('value',ele.value);
                console.log('value string ',JSON.stringify(ele.value));
                let cropObj = this.mapCustomerCrop(ele.value,ele.key)
                console.log('category obj ',cropObj);
                tempAllCropAllocations.push(cropObj);
            });
            setTimeout(() => {
                this.cropAllocations = tempAllCropAllocations;
                this.copyCropAllocationsVirtual = tempAllCropAllocations;
                console.log('CropAllocation ',JSON.stringify(this.cropAllocations));
                this.paginatedCropAllocation = this.cropAllocations;
                let copyCropAllocations = this.cropAllocations;
                this.getTableData(copyCropAllocations);
                setTimeout(() => {
                    this.paginatedCropAllocation.forEach(ele=>{
                        console.log('update row status ',ele);
                        this.updateStatus(ele.customerId);
                    })
                }, 200);
                this.updateStatusLabel();
            }, 200);
        }).catch(err=>{
            this.showLoading = false;
            console.log(err)
        });
    }

    getTableData(data){
        let year = this.fiscalYear.replace('-20','/');
        this.columnfiscalYear = `${this.labels.All_Companies_Purchase_to_Customer1} ${this.labels.All_Companies_Purchase_to_Customer2} ${year}`;
        if(data[0]){
            this.columns = data[0].crops;
        }
        console.log('columns ',this.columns);
    }
    handleCropDetailChange(event){
        console.log('detail changed ',event.currentTarget.dataset.detail);
        console.log('account ',event.currentTarget.dataset.accountid);
        let detailId =  event.currentTarget.dataset.detail;
        let accid = event.currentTarget.dataset.accountid;
        let value = event.target.value
        console.log('value ',value);
        if(String(value).length==0){
            this.template.querySelector('[data-detail="' + detailId + '"]').value = '0';
            value = 0;
        }
        if(Number(value)>=0){
        if(accid && value){
            this.updateGTMDetail(detailId,value);
            this.updateStatus(accid);
            this.onChangeLabelOption(value,accid,detailId);
            setTimeout(() => {
                this.updateStatusLabel();
            }, 200);
        }
        this.copyCropAllocationsVirtual.forEach(ele=>{
            ele.crops.forEach(e=>{
                if(e.GTMDetail==event.currentTarget.dataset.detail){
                    e.allocation = value;
                    this.updateStatus(event.currentTarget.dataset.accountid);
                }
            })
        })
        }
    }
    onChangeLabelOption(value,accid,detailId){
        console.log('Value ',value);
        this.cropAllocations.forEach(ele=>{
            if(ele.customerId==accid){
                let percent = 100;
                let tempValue = value;
                ele.crops.forEach(e=>{
                    if(e.GTMDetail!=detailId){
                        tempValue = Number(e.allocation)+Number(tempValue);
                    }
                    console.log('temp Value --------->',tempValue);
                })
                percent = Number(percent) - Number(tempValue);
                console.log('percentage ---------->',percent);
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
            console.log('updated ',value);
        }).catch(err=>console.log('Error while updating GTMDetails ',gtmId,' ',err))
    }
    mapCustomerCrop(cropAllocation,customerid){
        let masterObj = {};
        let arr = [];
        let percentage = 100 
        cropAllocation.forEach(ele=>{
            if(ele.GTM_Customer__c == customerid){
            percentage = Number(percentage)-Number(ele.Crop_Allocation__c);
            let percentageLabel = '';
            if(percentage==0){
                percentageLabel = 'Completed';
            }else if(percentage>0 && percentage<100){
                percentageLabel = 'In Progress';
            }else if(percentage==100){
                percentageLabel = 'Not Fill';
            }
            console.log('percenatge ',percentage);
            let obj = {'cId':ele.Crop__r.Id,'cName':ele.Crop__r.Name,'GTMDetail':ele.Id,'allocation':ele.Crop_Allocation__c};
            arr.push(obj)
            masterObj = {customerId:ele.GTM_Customer__c,customerName:ele.GTM_Customer__r.Name,totalCompaniesPurches:ele.GTM_Details__r.Total_Purchase_of_Crop_Protection_PY__c,crops:arr,'isLeadCustomer':ele.GTM_Customer__r.Lead_Customer__c?true:false,percentage:percentageLabel,percentageValue:percentage,pathFinder:ele.GTM_Customer__r.Path_Finder__c};
            }
        })
        console.log('Master obj ',masterObj)
        return masterObj;
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
                col.firstChild.data = 'Distribution completed'
            }
            if(col.classList.value.includes('distribution') && inputCompleted<=100 && inputCompleted!=0){
                col.style.backgroundColor = 'red';
                col.style.color = '#fff';
                col.firstChild.data = 'Please check the values. Not matching 100%'
            }
        })
    }, 200);
    }

    updateStatusLabel(){
        let green= 0;
        let red=0;
        let yellow=0;
        console.log('Update satus lave ----------->');
        this.cropAllocations.forEach(ele=>{
            console.log('Update satus lave ele',ele);
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
        console.log('Update satus lave ----------->',this.options);
    }
    handlePaginationAction(event){
        this.paginatedCropAllocation = event.detail.values;
        let copyCropAllocations = this.cropAllocations;
        this.getTableData(copyCropAllocations);
            setTimeout(() => {
                this.paginatedCropAllocation.forEach(ele=>{
                    console.log('update row status ',ele);
                    this.updateStatus(ele.customerId);
                })
            }, 200);
        this.updateStatusLabel();
    }
    handleFilterPanelAction(event){
        let filtersValue = JSON.parse(JSON.stringify(event.detail));
        this.applyFiltersOnCustomer(filtersValue);
    }

    applyFiltersOnCustomer(filtersValue){
        this.template.querySelector('c-pagination-cmp').pagevalue = 1;
        console.log('filtersValue -------------->',filtersValue);
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
        console.log('search str length ',searchValue.length);
        this.getCalculatedPercentage();
        console.log('original data ',this.copyCropAllocationsVirtual);
        this.cropAllocations = [];
        this.paginatedCropAllocation =[];
        this.cropAllocations = this.copyCropAllocationsVirtual.filter(ele=>{
            console.log(' Condition search',search,' Condition filter1 ',filter1,' Condition filter2 ',filter2);
            console.log('Value search',searchValue,' filter1 ',filter1Value,' filter2 ',filter2Value);
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
        console.log('return  Crop ',this.cropAllocations);
        this.copyCropAllocationsVirtual.forEach(ele=>{
            this.updateStatus(ele.customerId);
        })
       this.paginatedCropAllocation = JSON.parse(JSON.stringify(this.cropAllocations));
    }

    getCalculatedPercentage(){
        this.copyCropAllocationsVirtual.forEach((ele)=>{
            let percentage = 100;
            ele.crops.forEach(e=>{
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
            }, 50);
        })
    }
    handleSort(event){
        let fieldName = event.target.name;
        this.sortDirection = !this.sortDirection;
        this.sortData(fieldName,this.sortDirection);
    }

    sortData(fieldname, direction) {
        direction = direction==true?'asc':'des';
        console.log('Field Name ',fieldname,' direction ',direction);
        let parseData = JSON.parse(JSON.stringify(this.copyCropAllocationsVirtual));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.cropAllocations = parseData;
    }

}