import { LightningElement,track, wire } from 'lwc';
import { getPicklistValues, getObjectInfo} from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import LeadCustomerType from '@salesforce/schema/Account.Lead_Customer_Type__c';
import getPotentialAndProfile from '@salesforce/apex/GTMPathFinder.getPotentialAndProfile'
import updateGTMDetailPotentialProfile from '@salesforce/apex/GTMPathFinder.updateGTMDetailPotentialProfile';

export default class GtmPotentialAndProfile extends LightningElement {
    
    @track gtmPotentialProfile=[];
    gtmPotentialProfileVirtual = [];
    @track paginatedGtmPotentialProfile
    customerTypeOptions = [];
    @track recordTypeId;
    @track panelStatus={
        notFilled:'0',
        inProgress:'0',
        completed:'0'
    }
    defaultSelectedOption = '';

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

    connectedCallback(){
       
        getPotentialAndProfile().then(data=>{
            let tempData = [];
            if(data){
                data.forEach(ele=>{
                    let obj = {
                        id:ele.Id,
                        client:ele.GTM_Customer__r.Name,
                        customerType:ele.GTM_Customer_Type__c,
                        confirmCustomerType:ele.GTM_Customer_Type__c,
                        totalPurcahseCrop:ele.Total_Purchase_of_Crop_Protection_PY__c,
                        estimateChannel:ele.Estimated_Markup_of_Channel__c,
                        confirmEstimateRevenues:'',
                        estimateSalesRepRole:ele.Estimated_Number_of_Sales_Rep_on_Role__c,
                        storiesChannelHas:ele.Number_of_Stores_That_the_Channel_Has__c,
                        status:'',
                        numberOfFieldsFilled:''
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
                }, 200);
                console.log('Potential Profile data ',this.gtmPotentialProfile);
            }
        })
    }

    handleChangeInput(event){
       
        let fieldName = event.target.dataset.name;
        let value = event.target.value;
        let detailId = event.target.dataset.id;
        if(value==''){
            value =0;
        }
        updateGTMDetailPotentialProfile({gtmId:detailId,name:fieldName,value:value}).then(res=>{
            console.log('Response ',res);
        });
        
        let objIndex = this.gtmPotentialProfile.findIndex(obj=>obj.id==detailId);
        
        if(fieldName=='GTM_Customer_Type__c'){
            let comboboxValue = event.detail.value;
            if(comboboxValue){
                console.log('comboBox enter ',comboboxValue);
                this.gtmPotentialProfile[objIndex].customerType = comboboxValue;
                this.gtmPotentialProfile[objIndex].confirmCustomerType = comboboxValue;
            }
        }else if(fieldName=='Total_Purchase_of_Crop_Protection_PY__c'){
            this.gtmPotentialProfile[objIndex].totalPurcahseCrop = value;
        }else if(fieldName=='Estimated_Markup_of_Channel__c'){
            this.gtmPotentialProfile[objIndex].estimateChannel = value;
        }else if(fieldName=='Estimated_Number_of_Sales_Rep_on_Role__c'){
            this.gtmPotentialProfile[objIndex].estimateSalesRepRole = value;
        }else if(fieldName=='Number_of_Stores_That_the_Channel_Has__c'){
            this.gtmPotentialProfile[objIndex].storiesChannelHas = value;
        }
        
        setTimeout(() => {
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
                e.customerType = value;
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
        console.log('filtersValue -------------->',filtersValue);
        let search = filtersValue.search.length!=0;
        let filter1 = filtersValue.filter1.length!=0 && filtersValue.filter1!='Both';
        let filter2 = filtersValue.filter2.length!= 0 && filtersValue.filter2!='None';

        let searchValue = filtersValue.search;
        let filter1Value = filtersValue.filter1;
        let filter2Value = filtersValue.filter2;
    }

    handlePaginationAction(event){
        // this.gtmPotentialProfile = JSON.parse(JSON.stringify(this.gtmPotentialProfile));
        setTimeout(() => {
            this.paginatedGtmPotentialProfile = event.detail.values;
        }, 200);
    }
    handleCustomerTypeChange(event){
       
    }
}