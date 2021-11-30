import { LightningElement,track,wire } from 'lwc';
import getCatergoryAllocation from '@salesforce/apex/GTMPathFinder.getCatergoryAllocation'
import getFiscalYear from '@salesforce/apex/GTMPathFinder.getFiscalYear'
import AccountId from '@salesforce/schema/Case.AccountId';

export default class GtmCategoryAllocation extends LightningElement {
    @track productAllocations = [];
    @track options = {
        notFilled:'0',
        inProgress:'0',
        completed:'0' 
    }
    @track paginatedProductCategoryAllocation = [];
    columns = [];
    fiscalYear = '';
    columnfiscalYear = '';
    connectedCallback(){
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
            }, 200);
        }).catch(err=>console.log(err));
    }

    handleProductDetailChange(event){
        console.log('detail changed ',event.currentTarget.dataset.detail);
        console.log('account ',event.currentTarget.dataset.accountid);
        if(event.currentTarget.dataset.accountid){
            this.updateStatus(event.currentTarget.dataset.accountid);
        }
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
        productAllocation.forEach(ele=>{
            if(ele.GTM_Customer__c == customerid){
            let obj = {'pId':ele.Product_Category__r.Id,'pName':ele.Product_Category__r.Name,'GTMDetail':ele.Id};
            arr.push(obj)
            masterObj = {customerId:ele.GTM_Customer__c,customerName:ele.GTM_Customer__r.Name,productCategory:arr};
            }
        })
        console.log('Master obj ',masterObj)
        return masterObj;
    }

    handlePaginationAction(event){
        this.paginatedProductCategoryAllocation = event.detail.values;
    }
    handleFilterPanelAction(event){
        console.log('event handle',JSON.parse(JSON.stringify(event.detail)));
    }

    updateStatus(customerId){
        let inputCompleted = 0;
        let inputsLength = 0;
        this.template.querySelectorAll('[data-accountid="' + customerId + '"]').forEach(col=>{
            console.log('classes ',col.classList.value);
            if(col.classList.value.includes('inputDetails')){
                inputsLength++;
                if(col.value){
                    inputCompleted = Number(inputCompleted) + Number(col.value);
                    console.log('value ',col.value);
                }
            }
            if(col.classList.value.includes('percentage')){
                console.log('percentage ',col);
                col.innerHTML = `${inputCompleted} %`;
            }
            if(col.classList.value.includes('distribution')){
                col.style.backgroundColor = 'red';
                col.style.color = '#fff';
                col.innerHTML = 'Please check the values. Not matching 100%'
            }
            if(col.classList.value.includes('distribution') && inputCompleted==100){
                col.style.backgroundColor = 'green';
                col.style.color = '#fff';
                col.innerHTML = 'Distribution completed'
            }
        })
    }
}