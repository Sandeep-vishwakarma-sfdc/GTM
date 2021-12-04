import { LightningElement,track,wire } from 'lwc';
import getCatergoryAllocation from '@salesforce/apex/GTMPathFinder.getCatergoryAllocation'
import getFiscalYear from '@salesforce/apex/GTMPathFinder.getFiscalYear'
import updateGTMDetail from '@salesforce/apex/GTMPathFinder.updateGTMDetailProductAllocation';
export default class GtmCategoryAllocation extends LightningElement {
    @track productAllocations = [];
    copyproductAllocationsVirtual = [];
    showLoading = false;
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
    connectedCallback(){
        this.showLoading = true;
        Promise.all([getFiscalYear(),getCatergoryAllocation()]).then(result=>{
            console.log('results ',result);
            this.fiscalYear = '';
            let data = [];
            let tempProductAllocation=[];
            let tempAllProductAllocations = [];
            if(result.length==2){
                this.fiscalYear = result[0];
                data = result[1]
            }
            console.log('getCatergoryAllocation',data);
            for(let key in data){
                tempProductAllocation.push({key:key,value:data[key]})
            }
            tempProductAllocation.forEach(ele=>{
                console.log('value',ele.value);
                console.log('value string ',JSON.stringify(ele.value));
                let categoryObj = this.mapCustomerCategory(ele.value,ele.key)
                console.log('category obj ',categoryObj);
                tempAllProductAllocations.push(categoryObj);
            });
            setTimeout(() => {
                this.productAllocations = tempAllProductAllocations;
                this.copyproductAllocationsVirtual = tempAllProductAllocations;
                console.log('ProductAllocation ',this.productAllocations);
                this.paginatedProductCategoryAllocation = this.productAllocations;
                let copyProductAllocations = this.productAllocations;
                this.getTableData(copyProductAllocations);
                setTimeout(() => {
                    this.paginatedProductCategoryAllocation.forEach(ele=>{
                        console.log('update row status ',ele);
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
    }

    handleProductDetailChange(event){
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
        console.log('Value ',value);
        this.productAllocations.forEach(ele=>{
            if(ele.customerId==accid){
                let percent = 100;
                let tempValue = value;
                ele.productCategory.forEach(e=>{
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

    getTableData(data){
        let year = this.fiscalYear.replace('-20','/');
        this.columnfiscalYear = `All Companies Purchase To Customer ${year}`;
        this.columns = data[0].productCategory;
        console.log('columns ',this.columns);
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
            masterObj = {customerId:ele.GTM_Customer__c,customerName:ele.GTM_Customer__r.Name,productCategory:arr,'isLeadCustomer':ele.GTM_Customer__r.Lead_Customer__c?true:false,percentage:percentageLabel,percentageValue:percentage};
            }
        })
        console.log('Master obj ',masterObj)
        return masterObj;
    }

    handlePaginationAction(event){
        this.paginatedProductCategoryAllocation = event.detail.values;
    }
   
    handleFilterPanelAction(event){
        let filtersValue = JSON.parse(JSON.stringify(event.detail));
        this.applyFiltersOnCustomer(filtersValue);
    }
//searchStr,isLead,percentage
    applyFiltersOnCustomer(filtersValue){
        console.log('filtersValue -------------->',filtersValue);
        let search = filtersValue.search.length!=0;
        let filter1 = filtersValue.filter1.length!=0 && filtersValue.filter1!='Both';
        let filter2 = filtersValue.filter2.length!= 0 && filtersValue.filter2!='None';
        let searchValue = filtersValue.search;
        let filter1Value = filtersValue.filter1;
        if(filter1Value=='Lead Customer'){
            filter1Value = true;
        }
        if(filter1Value=='Non Lead Customer'){
            filter1Value = false;
        }
        let filter2Value = filtersValue.filter2;
        console.log('search str length ',searchValue.length);
        this.getCalculatedPercentage();
        console.log('original data ',this.copyproductAllocationsVirtual);
        this.productAllocations = [];
        this.paginatedProductCategoryAllocation =[];
        this.productAllocations = this.copyproductAllocationsVirtual.filter(ele=>{
            console.log(' Condition search',search,' Condition filter1 ',filter1,' Condition filter2 ',filter2);
            console.log('Value search',searchValue,' filter1 ',filter1Value,' filter2 ',filter2Value);
            let custName = String(ele.customerName).toLowerCase();
            if( search && filter1 && filter2){
                console.log('condition 1');
                return custName.includes(searchValue) && ele.isLeadCustomer==filter1Value && ele.percentage==filter2Value;
            }else if(search && filter1 && !filter2){
                console.log('condition 2');
                return custName.includes(searchValue) && ele.isLeadCustomer==filter1Value;
            }else if(search && !filter1 && filter2){
                console.log('condition 3');
                return custName.includes(searchValue) && ele.percentage==filter2Value;
            }else if(search && !filter1 && !filter2){
                console.log('condition 4');
                return custName.includes(searchValue);
            }else if(!search && filter1 && filter2){
                console.log('condition 5');
                return ele.isLeadCustomer==filter1Value && ele.percentage==filter2Value;
            }else if(!search && filter1 && !filter2){
                console.log('condition 6');
                if(ele.isLeadCustomer==filter1Value){
                    console.log('ele found ',ele);
                }
                return ele.isLeadCustomer==filter1Value;
            }else if(!search && !filter1 && filter2){
                console.log('condition 7');
                return ele.percentage==filter2Value;
            }else if(!search && !filter1 && !filter2){
                console.log('condition 8');
                return true;
            }
        });
        console.log('return  products ',this.productAllocations);
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
        this.productAllocations.forEach(ele=>{
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

    handleSort(event){
        let fieldName = event.target.name;
        this.sortDirection==!this.sortDirection;
        this.sortData(fieldName,this.sortDirection);
    }

    sortData(fieldname, direction) {
        direction==true?'asc':'des';
        console.log('Field Name ',fieldname,' direction ',direction);
        let parseData = JSON.parse(JSON.stringify(this.paginatedCropAllocation));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.paginatedCropAllocation = parseData;
    }
}