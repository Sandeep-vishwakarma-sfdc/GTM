import { LightningElement,track, wire,api } from 'lwc';
import { getPicklistValues, getObjectInfo} from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import LeadCustomerType from '@salesforce/schema/Account.Lead_Customer_Type__c';
import getPotentialAndProfile from '@salesforce/apex/GTMPathFinder.getPotentialAndProfile'
import isWindowPeriodClosed from '@salesforce/apex/GTMPathFinder.isWindowPeriodClosed';
import updateGTMDetailPotentialProfile from '@salesforce/apex/GTMPathFinder.updateGTMDetailPotentialProfile';
import getFiscalYear from '@salesforce/apex/GTMPathFinder.getFiscalYear';
import getInstructions from '@salesforce/apex/GTMPathFinder.getInstructions';
import Instructions from '@salesforce/label/c.Instructions';
import Customer_Lead_Customer from '@salesforce/label/c.Customer_Lead_Customer';
import Customer_Type from '@salesforce/label/c.Customer_Type';
import Confirm_Customer_Type_Indicated_on_the_Left_Adjacent_Cell from '@salesforce/label/c.Confirm_Customer_Type_Indicated_on_the_Left_Adjacent_Cell';
import Total_Purcahse_of_Crop_Protection_Industry_Price from '@salesforce/label/c.Total_Purcahse_of_Crop_Protection_Industry_Price';
import Estimated_Number_Of_Sales_REP_on_Role from '@salesforce/label/c.Estimated_Number_Of_Sales_REP_on_Role';
import Number_of_Stories_That_the_Channel_has from '@salesforce/label/c.Number_of_Stories_That_the_Channel_has';
import Confirm_the_Estimated_Revenues_of_the_Customer_in from '@salesforce/label/c.Confirm_the_Estimated_Revenues_of_the_Customer_in';
import Estimated_Markup_of_Channel_In_of_Sales from '@salesforce/label/c.Estimated_Markup_of_Channel_In_of_Sales';
import USD_Million from '@salesforce/label/c.USD_Million';
import The_total_farm_gate_revenues_are_USD from '@salesforce/label/c.The_total_farm_gate_revenues_are_USD';
import Page from '@salesforce/label/c.Page';

export default class GtmPotentialAndProfile extends LightningElement {
    instrustions = '';
    showLoading = false;
    @track gtmPotentialProfile=[];
    gtmPotentialProfileVirtual = [];
    @track paginatedGtmPotentialProfile
    customerTypeOptions = [];
    optionsToDisable = ['Farmer','B2B'];
    sortDirection = true;
    disableAll = false;
    @track recordTypeId;
    @track panelStatus={
        notFilled:'0',
        inProgress:'0',
        completed:'0'
    }
    @track currentPage = 1;
    defaultSelectedOption = '';
    fiscalYear = '';

    labels = {
        Instructions:Instructions,
        Customer_Lead_Customer:Customer_Lead_Customer,
        Customer_Type:Customer_Type,
        Confirm_Customer_Type_Indicated_on_the_Left_Adjacent_Cell1:Confirm_Customer_Type_Indicated_on_the_Left_Adjacent_Cell,
        Total_Purcahse_of_Crop_Protection_Industry_Price1:Total_Purcahse_of_Crop_Protection_Industry_Price,
        Estimated_Markup_of_Channel_In_of_Sales1:Estimated_Markup_of_Channel_In_of_Sales,
        Confirm_the_Estimated_Revenues_of_the_Customer_in1:Confirm_the_Estimated_Revenues_of_the_Customer_in,
        Estimated_Number_Of_Sales_REP_on_Role1:Estimated_Number_Of_Sales_REP_on_Role,
        Number_of_Stories_That_the_Channel_has1:Number_of_Stories_That_the_Channel_has,
        Page:Page,
        The_total_farm_gate_revenues_are_USD:The_total_farm_gate_revenues_are_USD,
        USD_Million:USD_Million
    }

    @wire(getInstructions) getInstrustion({error,data}){
        if(data){
            this.instrustions = data.Instruction_Profile_Potential__c;
        }
    }

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    wiredObjectInfo({error, data}) {
      if (error) {
        // handle Error
      } else if (data) {
          console.log('Account data ',data);
        const rtis = data.recordTypeInfos;
        this.recordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === 'Lead Customer');
      }
    };
    @wire(getPicklistValues, {
        recordTypeId: "$recordTypeId",
        fieldApiName: LeadCustomerType
      })
    customerTypePicklistValues({error,data}){
        console.log('customerTypeOptions ',data);
        if(data){
            console.log('picklist Values',data.values);
            let obj = {attributes: null, label: 'Customer Type is Already Correct', validFor: Array(0), value: ''}
            this.customerTypeOptions = [...data.values,obj];
        }
    }

    @api onTabRefresh(){
        
        setTimeout(() => {
            this.connectedCallback();
        }, 500);
    }

    connectedCallback(){
        this.showLoading = true;
       console.log('log ...');
        getPotentialAndProfile().then(data=>{
            let tempData = [];
            
            if(data){
                data.forEach(ele=>{
                    let tempValue = ele.Total_Purchase_of_Crop_Protection_PY__c?ele.Total_Purchase_of_Crop_Protection_PY__c:0;
                    let obj = {
                        id:ele.Id,
                        client:ele.GTM_Customer__r.Name,
                        clientId:ele.GTM_Customer__c,
                        customerType:ele.GTM_Customer__r.Lead_Customer_Type__c,
                        confirmCustomerType:ele.GTM_Customer_Type__c?String(ele.GTM_Customer_Type__c):'',
                        totalPurcahseCrop:ele.Total_Purchase_of_Crop_Protection_PY__c,
                        estimateChannel:ele.Estimated_Markup_of_Channel__c,
                        confirmEstimateRevenues:'',
                        estimateSalesRepRole:ele.Estimated_Number_of_Sales_Rep_on_Role__c,
                        storiesChannelHas:ele.Number_of_Stores_That_the_Channel_Has__c,
                        status:'',
                        numberOfFieldsFilled:'',
                        isLeadCustomer:ele.GTM_Customer__r.Lead_Customer__c?true:false,
                        confirmEstimatedRevenue:`${this.labels.The_total_farm_gate_revenues_are_USD}  ${tempValue} ${this.labels.USD_Million}	
                        `,
                        pathFinder:ele.GTM_Customer__r.Path_Finder__c,
                        disableFields:this.optionsToDisable.includes(ele.GTM_Customer_Type__c)
                    }
                    tempData.push(obj);
                });
                setTimeout(() => {
                    this.gtmPotentialProfile = tempData;
                    console.log('gtmPotentialProfile string',JSON.stringify(this.gtmPotentialProfile));
                    this.gtmPotentialProfileVirtual = tempData;
                    this.paginatedGtmPotentialProfile = this.gtmPotentialProfile;
                        this.gtmPotentialProfile.forEach(ele=>{
                            this.handleChangeStatusOnLoad(ele.id);
                            this.updateStatusLabel();
                        })
                        this.showLoading = false;
                }, 200);
                console.log('Potential Profile data ',this.gtmPotentialProfile);
            }
        });
        getFiscalYear().then(fiscalyear=>{
            this.fiscalYear = fiscalyear.replace('-20','/');
        })
        isWindowPeriodClosed().then(isDisable=>{
            this.disableAll = isDisable
        })
    }

    handleChangeInput(event){
       
        let fieldName = event.target.dataset.name;
        let value = event.target.value;
        let detailId = event.target.dataset.id;
        if(value=='' || (Number(value)<0 && fieldName!='Estimated_Markup_of_Channel__c')){
            value = null;
        }
        updateGTMDetailPotentialProfile({gtmId:detailId,name:fieldName,value:value}).then(res=>{
            console.log('Response ',res);
        }).catch(err=>console.log('Null Value'+err));
        
        let objIndex = this.gtmPotentialProfile.findIndex(obj=>obj.id==detailId);
        
        if(fieldName=='GTM_Customer_Type__c'){
            let comboboxValue = event.detail.value;
            if(comboboxValue){
                console.log('comboBox enter ',comboboxValue);
                // this.gtmPotentialProfile[objIndex].customerType = comboboxValue;
                this.gtmPotentialProfile[objIndex].disableFields = this.optionsToDisable.includes(value);
                this.gtmPotentialProfile[objIndex].confirmCustomerType = comboboxValue;
            }
        }else if(fieldName=='Total_Purchase_of_Crop_Protection_PY__c'){
            let temp = value?value:0;
            this.gtmPotentialProfile[objIndex].totalPurcahseCrop = value;
            this.gtmPotentialProfile[objIndex].confirmEstimatedRevenue = `${this.labels.The_total_farm_gate_revenues_are_USD} ${temp} ${this.labels.USD_Million}	
            `
        }else if(fieldName=='Estimated_Markup_of_Channel__c'){
            this.gtmPotentialProfile[objIndex].estimateChannel = value;
        }else if(fieldName=='Estimated_Number_of_Sales_Rep_on_Role__c'){
            this.gtmPotentialProfile[objIndex].estimateSalesRepRole = value;
        }else if(fieldName=='Number_of_Stores_That_the_Channel_Has__c'){
            this.gtmPotentialProfile[objIndex].storiesChannelHas = value;
        }
        
        setTimeout(() => {
            let tempData = JSON.parse(JSON.stringify(this.gtmPotentialProfile));
            this.gtmPotentialProfile = tempData;
            this.paginatedGtmPotentialProfile = this.gtmPotentialProfile;
            this.handleChangeStatusOnLoad(detailId);
            this.updateStatusLabel();
        }, 200);
    }
 

    updateStatusLabel(){
        let completeField = 0;
        let inProgressField = 0;
        let NotFilled = 0;
        this.gtmPotentialProfile.forEach(ele=>{
            if(ele.status=="Completed"){
                completeField++;
            }
            if(ele.status=="INProgress"){
                inProgressField++;
            }
            if(ele.status=="NotFilled"){
                NotFilled++;
            }
        });
        this.panelStatus = {
            notFilled:NotFilled,
            inProgress:inProgressField,
            completed:completeField
        }
    }
   
    handleChangeStatusOnLoad(detailId){
        console.log('detailId ',detailId);
            this.gtmPotentialProfile.forEach(ele=>{
                console.log('ele ',JSON.stringify(ele));
                let NumberOfFilled=0;
                if(ele.confirmCustomerType){
                    NumberOfFilled++;
                    console.log('Condition 1');
                }
                if(ele.totalPurcahseCrop && Number(ele.totalPurcahseCrop)!=0){
                    NumberOfFilled++;
                    console.log('Condition 2');
                }
                if(ele.estimateChannel && Number(ele.estimateChannel)!=0){
                    NumberOfFilled++;
                    console.log('Condition 3');
                }
                if(ele.estimateSalesRepRole && Number(ele.estimateSalesRepRole)!=0){
                    NumberOfFilled++;
                    console.log('Condition 4');
                }
                if(ele.storiesChannelHas && Number(ele.storiesChannelHas)!=0){
                    NumberOfFilled++;
                    console.log('Condition 5');
                }
                ele.numberOfFieldsFilled= NumberOfFilled;
                if(NumberOfFilled==5){
                    ele.status = 'Completed';
                }
                if(NumberOfFilled<5 && NumberOfFilled>0){
                    ele.status = 'INProgress';
                }
                if(NumberOfFilled==0){
                    ele.status = 'NotFilled';
                }
            })
            console.log('Added status ',this.gtmPotentialProfile);
    }

    handleChangeCustomerTypeOptions(event){
        let filedName = event.target.dataset.name;
        let id = event.target.dataset.id;
        let value = event.target.value;
        this.gtmPotentialProfile.forEach(e=>{
            if(e.id == id){
                e.confirmCustomerType = value;
                e.disableFields = this.optionsToDisable.includes(value);
            }
        })
        setTimeout(() => {
            this.paginatedGtmPotentialProfile = this.gtmPotentialProfile;
        }, 200);
        console.log(event.target.value);
        updateGTMDetailPotentialProfile({gtmId:id,name:filedName,value:value}).then(res=>{
            console.log('Response ',res);
        })
    }

    handleFiltersAction(event){
        console.log('filter action ',event.detail);
        let filterValues = JSON.parse(JSON.stringify(event.detail));
        this.applyFiltersOnCustomer(filterValues);
    }

    applyFiltersOnCustomer(filtersValue){
        this.template.querySelector('c-pagination-cmp').pagevalue = 1;
        console.log('filtersValue -------------->',filtersValue);
        let mapStatus = new Map([
            ["Not Fill", 'NotFilled'],
            ["In Progress", 'INProgress'],
            ["Completed", 'Completed']
          ]);
        let search = filtersValue.search.length!=0;
        let filter1 = filtersValue.filter1.length!=0 && filtersValue.filter1!='Both';
        let filter2 = filtersValue.filter2.length!= 0 && filtersValue.filter2!='None';
        let filter3 = filtersValue.filter3.length!= 0 && filtersValue.filter3!='Both';

        let searchValue = String(filtersValue.search).toLocaleLowerCase();
        let filter1Value = filtersValue.filter1;
        let filter2Value = filtersValue.filter2;
        let filter3Value = filtersValue.filter3;

        filter1Value = filter1Value=='Lead Customer'?true:false;

        this.gtmPotentialProfile = [];
        this.paginatedGtmPotentialProfile = [];

        this.gtmPotentialProfile = this.gtmPotentialProfileVirtual.filter(ele=>{
            let custName = String(ele.client).toLowerCase();
            if (search && filter1 && filter2 && filter3) {
                return custName.includes(searchValue) && String(ele.isLeadCustomer) == String(filter1Value) && ele.status == mapStatus.get(filter2Value) && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && filter1 && filter2 && !filter3) {
                return custName.includes(searchValue) && ele.isLeadCustomer == filter1Value && ele.status == mapStatus.get(filter2Value);
            }
            else if (search && filter1 && !filter2 && filter3) {
                return custName.includes(searchValue) && ele.isLeadCustomer == filter1Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && filter1 && !filter2 && !filter3) {
                return custName.includes(searchValue) && ele.isLeadCustomer == filter1Value;
            }
            else if (search && !filter1 && filter2 && filter3) {
                return custName.includes(searchValue) && ele.status == mapStatus.get(filter2Value) && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && !filter1 && filter2 && !filter3) {
                return custName.includes(searchValue) && ele.status == mapStatus.get(filter2Value);
            }
            else if (search && !filter1 && !filter2 && filter3) {
                return custName.includes(searchValue) && String(ele.pathFinder) == String(filter3Value);
            }
            else if (search && !filter1 && !filter2 && !filter3) {
                return custName.includes(searchValue);
            }
            else if (!search && filter1 && filter2 && filter3) {
                return ele.isLeadCustomer == filter1Value && ele.status == mapStatus.get(filter2Value) && String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && filter1 && filter2 && !filter3) {
                return String(ele.isLeadCustomer) == String(filter1Value) && ele.status == mapStatus.get(filter2Value);
            }
            else if (!search && filter1 && !filter2 && filter3) {
                return ele.isLeadCustomer == filter1Value && String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && filter1 && !filter2 && !filter3) {
                console.log(`isLeadCustomer ${ele.isLeadCustomer} filter1 ${filter1Value} ${String(ele.isLeadCustomer) == String(filter1Value)}`)
                return String(ele.isLeadCustomer) == String(filter1Value);
            }
            else if (!search && !filter1 && filter2 && filter3) {
                return ele.status == mapStatus.get(filter2Value) && String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && !filter1 && filter2 && !filter3) {
                return ele.status == mapStatus.get(filter2Value);
            }
            else if (!search && !filter1 && !filter2 && filter3) {
                return String(ele.pathFinder) == String(filter3Value);
            }
            else if (!search && !filter1 && !filter2 && !filter3) {
                return true;
            }
        })
        this.gtmPotentialProfileVirtual.forEach(ele=>{
            this.handleChangeStatusOnLoad(ele.id);
        })
       this.paginatedGtmPotentialProfile = JSON.parse(JSON.stringify(this.gtmPotentialProfile));
       setTimeout(() => {
           this.updateStatusLabel();
       }, 200);
    }

    handlePaginationAction(event){
        // this.gtmPotentialProfile = JSON.parse(JSON.stringify(this.gtmPotentialProfile));
        setTimeout(() => {
            console.log('curret Page ',event.detail.currentPage);
            this.paginatedGtmPotentialProfile = event.detail.values;
        }, 200);
    }
   
    handleSort(event){
        let fieldName = event.target.name;
        this.sortDirection = !this.sortDirection;
        this.sortData(fieldName,this.sortDirection);
    }

    sortData(fieldname, direction) {
        direction = direction==true?'asc':'des';
        console.log('Field Name ',fieldname,' direction ',direction);
        let parseData = JSON.parse(JSON.stringify(this.gtmPotentialProfileVirtual));
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
        this.gtmPotentialProfile = parseData;
        }

    }
}