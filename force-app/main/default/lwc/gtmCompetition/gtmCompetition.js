import { LightningElement, track, api, wire } from 'lwc';
import getGTMCompetition from '@salesforce/apex/GTMCompetition.getGTMCompetition';
import updateGTMDetails from '@salesforce/apex/GTMCompetition.updateGTMDetails';
import getCompetitorDetails from '@salesforce/apex/GTMCompetition.getCompetitorDetails';
import getInstructions1 from '@salesforce/apex/GTMCompetition.getInstructions1';
import Customer_Lead_Customer from '@salesforce/label/c.Customer_Lead_Customer';
import Write_UPL_POSITION from '@salesforce/label/c.Write_UPL_POSITION';
import UPL_s_Share_of_Wallet from '@salesforce/label/c.UPL_s_Share_of_Wallet';
import Write_the_name_of_the_1_Company from '@salesforce/label/c.Write_the_name_of_the_1_Company';
import Indicate_the_Share_of_Wallet_of_the_1_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_1_Company';
import Write_the_name_of_the_2_Company from '@salesforce/label/c.Write_the_name_of_the_2_Company';
import Indicate_the_Share_of_Wallet_of_the_2_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_2_Company';
import Write_the_name_of_the_3_Company from '@salesforce/label/c.Write_the_name_of_the_3_Company';
import Indicate_the_Share_of_Wallet_of_the_3_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_3_Company';
import Write_the_name_of_the_4_Company from '@salesforce/label/c.Write_the_name_of_the_4_Company';
import Indicate_the_Share_of_Wallet_of_the_4_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_4_Company';
import Write_the_name_of_the_5_Company from '@salesforce/label/c.Write_the_name_of_the_5_Company';
import Indicate_the_Share_of_Wallet_of_the_5_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_5_Company';
import Write_the_name_of_the_6_Company from '@salesforce/label/c.Write_the_name_of_the_6_Company';
import Indicate_the_Share_of_Wallet_of_the_6_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_6_Company';
import Write_the_name_of_the_7_Company from '@salesforce/label/c.Write_the_name_of_the_7_Company';
import Indicate_the_Share_of_Wallet_of_the_7_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_7_Company';
import Write_the_name_of_the_8_Company from '@salesforce/label/c.Write_the_name_of_the_8_Company';
import Indicate_the_Share_of_Wallet_of_the_8_Company from '@salesforce/label/c.Indicate_the_Share_of_Wallet_of_the_8_Company';
import Remaining from '@salesforce/label/c.Remaining';
import Check_If_Distribution_Is_Correct from '@salesforce/label/c.Check_If_Distribution_Is_Correct';
import Distribution_completed from '@salesforce/label/c.Distribution_completed';
import Please_check_the_values_Not_matching_100 from '@salesforce/label/c.Please_check_the_values_Not_matching_100';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateshare from '@salesforce/apex/GTMCompetition.updateshare';
import Share_wallet_already_reached_100 from '@salesforce/label/c.Share_wallet_already_reached_100';
import isWindowPeriodClosed from '@salesforce/apex/GTMPathFinder.isWindowPeriodClosed';
import getUser from '@salesforce/apex/GTMPathFinder.getUser';

export default class GtmCompetition extends LightningElement {
    
    disableAll = false;
    @track labels = {
        Customer_Lead_Customer: Customer_Lead_Customer,
        Write_UPL_POSITION: Write_UPL_POSITION,
        UPL_s_Share_of_Wallet: UPL_s_Share_of_Wallet,
        Remaining: Remaining,
        Check_If_Distribution_Is_Correct: Check_If_Distribution_Is_Correct,
        Distribution_completed:Distribution_completed,
        Please_check_the_values_Not_matching_100: Please_check_the_values_Not_matching_100,
        Share_wallet_already_reached_100:Share_wallet_already_reached_100,

        Write_the_name_of_the_1_Company: Write_the_name_of_the_1_Company,
        

        Indicate_the_Share_of_Wallet_of_the_1_Company: Indicate_the_Share_of_Wallet_of_the_1_Company,
       

        Write_the_name_of_the_2_Company: Write_the_name_of_the_2_Company,
       
        Indicate_the_Share_of_Wallet_of_the_2_Company: Indicate_the_Share_of_Wallet_of_the_2_Company,

        Write_the_name_of_the_3_Company: Write_the_name_of_the_3_Company,
        Indicate_the_Share_of_Wallet_of_the_3_Company: Indicate_the_Share_of_Wallet_of_the_3_Company,
        Write_the_name_of_the_4_Company: Write_the_name_of_the_4_Company,
        Indicate_the_Share_of_Wallet_of_the_4_Company: Indicate_the_Share_of_Wallet_of_the_4_Company,
        Write_the_name_of_the_5_Company: Write_the_name_of_the_5_Company,
        Indicate_the_Share_of_Wallet_of_the_5_Company: Indicate_the_Share_of_Wallet_of_the_5_Company,
        Write_the_name_of_the_6_Company: Write_the_name_of_the_6_Company,
        Indicate_the_Share_of_Wallet_of_the_6_Company: Indicate_the_Share_of_Wallet_of_the_6_Company,
        Write_the_name_of_the_7_Company: Write_the_name_of_the_7_Company,
        Indicate_the_Share_of_Wallet_of_the_7_Company: Indicate_the_Share_of_Wallet_of_the_7_Company,
        Write_the_name_of_the_8_Company: Write_the_name_of_the_8_Company,
        Indicate_the_Share_of_Wallet_of_the_8_Company: Indicate_the_Share_of_Wallet_of_the_8_Company,
    }

    @track gtmcompetitor = [];
    @track gtmcompetitor1
    gtmcompetitorVirtual = [];
    @api recordId;
    @track currentPage = 1;
    @track panelStatus = {
        notFilled: '0',
        inProgress: '0',
        completed: '0'
    }
    instrustions = '';
    hasRendered = false;
    @track hasOptionsAdded = false;
    fiscalYear = '';

    set gtmFiscalYear(value) {
        this.fiscalYear = value;
    }

    @api get gtmFiscalYear() {
        return this.fiscalYear;
    }

    @wire(getInstructions1) getInstruction({ error, data }) {
        if (data) {
            this.instrustions = data.Instruction_Competitor__c ;
        }
    }
   countryLocale = 'es-AR'
   constructor(){
    super()
    getUser().then(user=>{
        console.log('Country user ',user);
        if(user){
            if(user.Country=='Argentina'){
                this.countryLocale = 'es-AR';
            }
            if(user.Country=='Mexico'){
                this.countryLocale = 'es-MX';
            }
            if(user.Country=='Italy'){
                this.countryLocale = 'it-IT';
            }
        }
    }).catch(error=>{
        console.log(error);
    })
}




    @track sortDirection = true;

    value = 'new';
    statusOptions = [];

    
    @api onTabRefresh() {
        setTimeout(() => {
            this.hasOptionsAdded = true;
            this.connectedCallback();
        }, 500);
    }


    checkDataYear(){
        let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let d = new Date();
        let monthName = month[d.getMonth()];
        let currentYear = d.getFullYear();
        let year = (monthName=='Jan' || monthName=='Feb' || monthName=='Mar')?this.fiscalYear.split('-')[1]:this.fiscalYear.split('-')[0];
        if(currentYear!=year){
            this.disableAll = true;
        }else{
            isWindowPeriodClosed().then(isDisable=>{
                this.disableAll = isDisable
            });
        }
    }

       renderedCallback(){
        if(!this.hasRendered && this.gtmcompetitorVirtual.length>0){
            setTimeout(() => {
                this.gtmcompetitorVirtual.forEach(row=>{
                  if(row.isSubmitted__c){
                       this.template.querySelectorAll('[data-id="' + row.id + '"]').forEach(cell=>{
                         console.log('cell ',cell);
                         cell.disabled = true;
                      })
                    }
               })
               this.hasRendered = true;
           }, 500);
       }
      }


    connectedCallback() {

        Promise.all([getCompetitorDetails(), getGTMCompetition({year:this.fiscalYear})]).then(result => {
            let data = [];
            if (!this.hasOptionsAdded) {
                let objNone = { label: 'None', value: "none" };
                this.statusOptions.push(objNone);
            }

            if (result.length == 2) {
                result[0]=this.sortCompetitor('competitiorname','asc',result[0])
                result[0].forEach(element => {
                    console.log('element', element);
                    let obj = { label: element.competitiorname , value: element.competitiorId};
                    if (!this.hasOptionsAdded) {
                        this.statusOptions.push(obj);
                    }
                });
                
                data = result[1];
            }
            let tempData = [];
            if (data) {
                data.forEach(ele => {
                    let obj = {
                        id: ele.Id,
                        customer: ele.GTM_Customer__r.Name,
                        Competitor1: ele.Competitor_Name_1__c ? ele.Competitor_Name_1__c : '',
                        Competitor1Name: ele.Competitor_Name_1__r ? ele.Competitor_Name_1__r.Name : '',
                        Indicate1: ele.Indicate_share_wallet_of_competitor_1__c,
                        Competitor2: ele.Competitor_Name_2__c ? ele.Competitor_Name_2__c : '',
                        Competitor2Name: ele.Competitor_Name_2__r ? ele.Competitor_Name_2__r.Name : '',
                        Indicate2: ele.Indicate_share_wallet_of_competitor_2__c,
                        Competitor3: ele.Competitor_Name_3__c ? ele.Competitor_Name_3__c : '',
                        Competitor3Name: ele.Competitor_Name_3__r ? ele.Competitor_Name_3__r.Name : '',
                        Indicate3: ele.Indicate_share_wallet_of_competitor_3__c,
                        Competitor4: ele.Competitor_Name_4__c ? ele.Competitor_Name_4__c : '',
                        Competitor4Name: ele.Competitor_Name_4__r ? ele.Competitor_Name_4__r.Name : '',
                        Indicate4: ele.Indicate_share_wallet_of_competitor_4__c,
                        Competitor5: ele.Competitor_Name_5__c ? ele.Competitor_Name_5__c : '',
                        Competitor5Name: ele.Competitor_Name_5__r ? ele.Competitor_Name_5__r.Name : '',
                        Indicate5: ele.Indicate_share_wallet_of_competitor_5__c,
                        Competitor6: ele.Competitor_Name_6__c ? ele.Competitor_Name_6__c : '',
                        Competitor6Name: ele.Competitor_Name_6__r ? ele.Competitor_Name_6__r.Name : '',
                        Indicate6: ele.Indicate_share_wallet_of_competitor_6__c,
                        Competitor7: ele.Competitor_Name_7__c ? ele.Competitor_Name_7__c : '',
                        Competitor7Name: ele.Competitor_Name_7__r ? ele.Competitor_Name_7__r.Name : '',
                        Indicate7: ele.Indicate_share_wallet_of_competitor_7__c,
                        Competitor8: ele.Competitor_Name_8__c ? ele.Competitor_Name_8__c : '',
                        Competitor8Name: ele.Competitor_Name_8__r ? ele.Competitor_Name_8__r.Name : '',
                        Indicate8: ele.Indicate_share_wallet_of_competitor_8__c ? ele.Indicate_share_wallet_of_competitor_8__c : '',
                        uplposition: ele.UPL_Position__c ? ele.UPL_Position__c : '',
                        uplshare: ele.UPLs_share_of_wallet__c ? ele.UPLs_share_of_wallet__c : '',
                        status: '',
                        numberOfFieldsFilled: '',
                        isSubmitted__c:ele.isSubmitted__c,
                        isLeadCustomer: ele.GTM_Customer__r.Lead_Customer__c ? true : false,
                        
                        pathFinder: ele.GTM_Customer__r.Path_Finder__c,
                        options: this.statusOptions,
                        remainingOptions1: [],
                        remainingOptions2: [],
                        remainingOptions3: [],
                        remainingOptions4: [],
                        remainingOptions5: [],
                        remainingOptions6: [],
                        remainingOptions7: [],
                        remainingOptions8: [],
                        remainingPercentage: 100,
                        isDistributionCompleted: false,
                        isUPLSelected:false
                    }
                    tempData.push(obj);

                });
                tempData.forEach(obj => {
                    this.updatePicklistOptions(obj);
                })
                setTimeout(() => {
                    this.gtmcompetitor = tempData;
                    console.log('gtmcompetitor string', JSON.stringify(this.gtmcompetitor));

                    this.gtmcompetitorVirtual = tempData;
                    this.gtmcompetitor1 = this.gtmcompetitor;

                    this.gtmcompetitor.forEach(ele => {
                        
                        this.updateStatusLabel();
                    })
                }, 200);
                console.log('Competitior  data ', this.gtmcompetitor);
            }
        })
       this.checkDataYear();
    }


    handleInputChange(event) {
        console.log('detail value ', event.detail.value);
        console.log('label', event.target.label);
        let value = event.target.value;
        let id = event.currentTarget.dataset.id;
        let name = event.currentTarget.dataset.name;

        console.log(event.target.value);
        console.log('The id is', id);
        console.log('the name is', name);

        if(value=='')
        {
            value=null;
        }

      if(name=='UPL_Position__c' && value<9 )
       {
           value=null;
       }
        if ((value <0 || value>100)  && name!='UPL_Position__c') {
            value = null;
        }
       
        
        
        
        
        let gtmIndex = this.gtmcompetitor.findIndex((obj => obj.id == id));
        let tempOptions = this.statusOptions.filter(op=>String(op.value)==String(value))[0];
        let optionValue = tempOptions?tempOptions.label:'';

        if(optionValue=='UPL'){
            updateshare({ recordId: id}).then(data => {
                console.log('The new data is',data);
                updateGTMDetails({ recordId: id, name: name, value: value!='none'?value:null }).then(data => {
                    console.log('data updated', data);
                });
                
            });
        }else{
            updateGTMDetails({ recordId: id, name: name, value: value!='none'?value:null }).then(data => {
                console.log('data updated', data);
            });
        }
        updateGTMDetails({ recordId: id, name: name }).then(data => {
            console.log('data updated', data);
        });

        if (name == 'Competitor_Name_1__c') {
            this.gtmcompetitor[gtmIndex].Competitor1 = value!='none'?value:'';
            this.gtmcompetitor[gtmIndex].Competitor1Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
            console.log('the comp1 is', this.gtmcompetitor[gtmIndex].Competitor1)
            
        if ((name =='Indicate_share_wallet_of_competitor_1__c')&&( this.gtmcompetitor[gtmIndex].Competitor1Name)) {
            console.log('the comp2 is', this.gtmcompetitor[gtmIndex].Competitor1)
                this.gtmcompetitor[gtmIndex].Indicate1 = value;
            }
            else
            {
                this.gtmcompetitor[gtmIndex].Indicate1=null;
            }
        }
            
         if (name == 'Competitor_Name_2__c') {
            this.gtmcompetitor[gtmIndex].Competitor2 = value!='none'?value:''
            this.gtmcompetitor[gtmIndex].Competitor2Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        }  if (name == 'Indicate_share_wallet_of_competitor_2__c') {
            let temp=value;
            if(this.gtmcompetitor[gtmIndex].Indicate1>temp)

            {
               this.gtmcompetitor[gtmIndex].Indicate2=value;
            }
            else
            {
                this.gtmcompetitor[gtmIndex].Indicate2 =null;
            }
            
        }  if (name == 'Competitor_Name_3__c') {
            this.gtmcompetitor[gtmIndex].Competitor3 = value!='none'?value:''
            this.gtmcompetitor[gtmIndex].Competitor3Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        }  if (name == 'Indicate_share_wallet_of_competitor_3__c') 
        {
            
            let temp=value;
            if(((this.gtmcompetitor[gtmIndex].Indicate1)&&(this.gtmcompetitor[gtmIndex].Indicate2))>temp)

            {
                this.gtmcompetitor[gtmIndex].Indicate3 = value;
            }
            else
            {
                this.gtmcompetitor[gtmIndex].Indicate3 =null;
            }


        }  if (name == 'Competitor_Name_4__c') {
            this.gtmcompetitor[gtmIndex].Competitor4 = value!='none'?value:''
            this.gtmcompetitor[gtmIndex].Competitor4Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        }  if (name == 'Indicate_share_wallet_of_competitor_4__c') {
            this.gtmcompetitor[gtmIndex].Indicate4 = value;
            
        }  if (name == 'Competitor_Name_5__c') {
            this.gtmcompetitor[gtmIndex].Competitor5 = value!='none'?value:''
            this.gtmcompetitor[gtmIndex].Competitor5Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        }  if (name == 'Indicate_share_wallet_of_competitor_5__c') {
            this.gtmcompetitor[gtmIndex].Indicate5 = value;
        }
         if (name == 'Competitor_Name_6__c') {
            this.gtmcompetitor[gtmIndex].Competitor6 = value!='none'?value:''
            this.gtmcompetitor[gtmIndex].Competitor6Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        }  if (name == 'Indicate_share_wallet_of_competitor_6__c') {
            this.gtmcompetitor[gtmIndex].Indicate6 = value;
        }  if (name == 'Competitor_Name_7__c') {
            this.gtmcompetitor[gtmIndex].Competitor7 = value!='none'?value:''
            this.gtmcompetitor[gtmIndex].Competitor7Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        }  if (name == 'Indicate_share_wallet_of_competitor_7__c') {
            this.gtmcompetitor[gtmIndex].Indicate7 = value;
        }  if (name == 'Competitor_Name_8__c') {
            console.log('Competitor_Name_8__c');
            this.gtmcompetitor[gtmIndex].Competitor8 = value!='none'?value:''
            this.gtmcompetitor[gtmIndex].Competitor8Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        }  if (name == 'Indicate_share_wallet_of_competitor_8__c') {
            this.gtmcompetitor[gtmIndex].Indicate8 = value;
        }
        
         if (name == 'UPL_Position__c') {
            
                this.gtmcompetitor[gtmIndex].uplposition = value;
            
        }  if (name == 'UPLs_share_of_wallet__c') {
            this.gtmcompetitor[gtmIndex].uplshare = value;
        }
        
        
        this.updatePicklistOptions(this.gtmcompetitor[gtmIndex])
        setTimeout(() => {
            let tempData = JSON.parse(JSON.stringify(this.gtmcompetitor));
            this.gtmcompetitor = tempData;
            this.gtmcompetitorVirtual=tempData;
            this.gtmcompetitor1 = this.gtmcompetitor;
            
            this.updateStatusLabel();
        }, 200);
    }

    updateStatusLabel() {


        let completeField = 0;
        let inProgressField = 0;
        let NotFilled = 0;
        this.gtmcompetitor.forEach(ele => {
            if(ele.remainingPercentage==0){//Completed
                completeField++;
                ele.status = 'Completed';
            }
            if(ele.remainingPercentage>0 && ele.remainingPercentage<100){// In Progress
                inProgressField++;
                ele.status = 'INProgress';
            }
            if(ele.remainingPercentage==100){ // Not Filled
                NotFilled++;
                ele.status = 'NotFilled';
            }
        });
        this.panelStatus = {
            notFilled: NotFilled,
            inProgress: inProgressField,
            completed: completeField
        }
    }

  
    getCalculatedPercentage() {
        this.gtmcompetitorVirtual.forEach((ele) => {
            let remainingPercentage = 100;
            
            let percentageLabel = '';
            if (remainingPercentage == 0) {
                percentageLabel = 'Completed';
            } else if (remainingPercentage > 0 && remainingPercentage < 100) {
                percentageLabel = 'In Progress';
            } else if (remainingPercentage == 100) {
                percentageLabel = 'Not Fill';
            }
            setTimeout(() => {
                ele.remainingPercentage = percentageLabel;
                ele.percentageValue = remainingPercentage;
                // console.log('percentage label ',ele.percentage);
            }, 50);
        })
    }

    updateStatus(id) {
        let inputCompleted = 100;
        setTimeout(() => {
            this.template.querySelectorAll('[data-accountid="' + id + '"]').forEach(col => {
                //console.log('classes ',col.classList.value);
                if (col.classList.value.includes('inputDetails')) {
                    if (col.value) {
                        inputCompleted = Number(inputCompleted) - Number(col.value);
                        // console.log('value ',col.value);
                    }
                }
                if (col.classList.value.includes('percentage')) {
                    // console.log('percentage ',col);
                    col.firstChild.data = `${Number(Number(inputCompleted).toFixed(2)).toLocaleString(this.countryLocale)} %`;
                }
                if (col.classList.value.includes('distribution')) {
                    col.style.backgroundColor = 'green';
                    col.style.color = '#fff';
                    col.firstChild.data = 'Distribution completed'
                }
                if (col.classList.value.includes('distribution') && inputCompleted <= 100 && inputCompleted != 0) {
                    col.style.backgroundColor = 'red';
                    col.style.color = '#fff';
                    col.firstChild.data = 'Please check the values. Not matching 100%'
                }
            })
        }, 200);
    }


    handleSort(event) {
        let fieldName = event.target.name;
        this.sortDirection = !this.sortDirection;
        this.sortData(fieldName, this.sortDirection);

    }

    sortData(fieldname, direction) {
        direction = direction == true ? "asc" : "des";
        console.log("Field Name ", fieldname, " direction ", direction);
        let parseData = JSON.parse(JSON.stringify(this.gtmcompetitor1));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === "asc" ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : "";
            y = keyValue(y) ? keyValue(y) : "";
            return isReverse * ((x > y) - (y > x));
        });
        this.gtmcompetitor1 = parseData;
        console.log('The Sorting data', this.gtmcompetitor1)
    }

    sortCompetitor(fieldname, direction,wrapperdata) {
       
        console.log("Field Name ", fieldname, " direction ", direction);
        let parseData = JSON.parse(JSON.stringify(wrapperdata));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === "asc" ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : "";
            y = keyValue(y) ? keyValue(y) : "";
            return isReverse * ((x > y) - (y > x));
        });
        wrapperdata = parseData;
        
        console.log('competitior sorted', wrapperdata)
        return wrapperdata;
    }


    handlePaginationAction(event) {
        setTimeout(() => {
            console.log('curret Page ', event.detail.currentPage);
            this.gtmcompetitor1 = event.detail.values;
        }, 200);

    }


    handleFiltersAction(event) {
        let filtersValue = JSON.parse(JSON.stringify(event.detail));
        this.applyFiltersOnCustomer(filtersValue);
    }


    applyFiltersOnCustomer(filtersValue) {
        this.template.querySelector('c-pagination-cmp').pagevalue = 1;
        console.log('filtersValue -------------->', filtersValue);
        let mapStatus = new Map([
            ["Not Fill", 'NotFilled'],
            ["In Progress", 'INProgress'],
            ["Completed", 'Completed']
        ]);
        let search = filtersValue.search.length != 0;
        let filter1 = filtersValue.filter1.length != 0 && filtersValue.filter1 != 'Both';
        let filter2 = filtersValue.filter2.length != 0 && filtersValue.filter2 != 'None';
        let filter3 = filtersValue.filter3.length != 0 && filtersValue.filter3 != 'Both';
        let searchValue = String(filtersValue.search).toLocaleLowerCase();
        let filter1Value = filtersValue.filter1;
        let filter2Value = filtersValue.filter2;
        let filter3Value = filtersValue.filter3;
        filter1Value = filter1Value == 'Lead Customer' ? true : false;


        this.gtmcompetitor = [];
        this.gtmcompetitor1 = [];

        this.gtmcompetitor = this.gtmcompetitorVirtual.filter(ele => {
            let custName = String(ele.customer).toLowerCase();
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
        
        this.gtmcompetitor1 = JSON.parse(JSON.stringify(this.gtmcompetitor));
        setTimeout(() => {
            this.updateStatusLabel();
        }, 200);
    }

    updatePicklistOptions(obj) {
        console.log('The value of obj is',obj)
        console.log('the id of obj is',obj.Indicate1);
        

        obj.remainingOptions1 = obj.options.filter(ele => {
            return ele.value != obj.Competitor2 && ele.value != obj.Competitor3 && ele.value != obj.Competitor4 && ele.value != obj.Competitor5 && ele.value != obj.Competitor6 && ele.value != obj.Competitor7 && ele.value != obj.Competitor8
        });
        obj.remainingOptions2 = obj.options.filter(ele => {
            return ele.value != obj.Competitor1 && ele.value != obj.Competitor3 && ele.value != obj.Competitor4 && ele.value != obj.Competitor5 && ele.value != obj.Competitor6 && ele.value != obj.Competitor7 && ele.value != obj.Competitor8
        });
        obj.remainingOptions3 = obj.options.filter(ele => {
            return ele.value != obj.Competitor1 && ele.value != obj.Competitor2 && ele.value != obj.Competitor4 && ele.value != obj.Competitor5 && ele.value != obj.Competitor6 && ele.value != obj.Competitor7 && ele.value != obj.Competitor8
        });
        obj.remainingOptions4 = obj.options.filter(ele => {
            return ele.value != obj.Competitor1 && ele.value != obj.Competitor2 && ele.value != obj.Competitor3 && ele.value != obj.Competitor5 && ele.value != obj.Competitor6 && ele.value != obj.Competitor7 && ele.value != obj.Competitor8
        });
        obj.remainingOptions5 = obj.options.filter(ele => {
            return ele.value != obj.Competitor1 && ele.value != obj.Competitor2 && ele.value != obj.Competitor3 && ele.value != obj.Competitor4 && ele.value != obj.Competitor6 && ele.value != obj.Competitor7 && ele.value != obj.Competitor8
        });
        obj.remainingOptions6 = obj.options.filter(ele => {
            return ele.value != obj.Competitor1 && ele.value != obj.Competitor2 && ele.value != obj.Competitor3 && ele.value != obj.Competitor4 && ele.value != obj.Competitor5 && ele.value != obj.Competitor7 && ele.value != obj.Competitor8
        });
        obj.remainingOptions7 = obj.options.filter(ele => {
            return ele.value != obj.Competitor1 && ele.value != obj.Competitor2 && ele.value != obj.Competitor3 && ele.value != obj.Competitor4 && ele.value != obj.Competitor5 && ele.value != obj.Competitor6 && ele.value != obj.Competitor8
        });
        obj.remainingOptions8 = obj.options.filter(ele => {
            return ele.value != obj.Competitor1 && ele.value != obj.Competitor2 && ele.value != obj.Competitor3 && ele.value != obj.Competitor4 && ele.value != obj.Competitor5 && ele.value != obj.Competitor6 && ele.value != obj.Competitor7
        });
        if (!obj.Competitor1 && !obj.Competitor2 && !obj.Competitor3 && !obj.Competitor4 && !obj.Competitor5 && !obj.Competitor6 && !obj.Competitor7 && !obj.Competitor8) {
            if (obj.remainingOptions1.length == 0) {
                obj.remainingOptions1 = obj.options;
            }
            if (obj.remainingOptions2.length == 0) {
                obj.remainingOptions2 = obj.options;
            }
            if (obj.remainingOptions3.length == 0) {
                obj.remainingOptions3 = obj.options;
            }
            if (obj.remainingOptions4.length == 0) {
                obj.remainingOptions4 = obj.options;
            }
            if (obj.remainingOptions5.length == 0) {
                obj.remainingOptions5 = obj.options;
            }
            if (obj.remainingOptions6.length == 0) {
                obj.remainingOptions6 = obj.options;
            }
            if (obj.remainingOptions7.length == 0) {
                obj.remainingOptions7 = obj.options;
            }
            if (obj.remainingOptions8.length == 0) {
                obj.remainingOptions8 = obj.options;
            }
        }
        if(String(obj.Competitor1Name).toLowerCase()=='UPL'.toLowerCase() || String(obj.Competitor2Name).toLowerCase()=='UPL'.toLowerCase() || String(obj.Competitor3Name).toLowerCase()=='UPL'.toLowerCase() || String(obj.Competitor4Name).toLowerCase()=='UPL'.toLowerCase() || String(obj.Competitor5Name).toLowerCase()=='UPL'.toLowerCase() || String(obj.Competitor6Name).toLowerCase()=='UPL'.toLowerCase() || String(obj.Competitor7Name).toLowerCase()=='UPL'.toLowerCase() || String(obj.Competitor8Name).toLowerCase()=='UPL'.toLowerCase()){
            obj.isUPLSelected=true
            obj.uplposition='';
            obj.uplshare='';
            updateshare({ recordId: obj.id}).then(data => {

                console.log('The new data is',data);
               });
        }
        else{
            obj.isUPLSelected=false
        }
        let initialPercentage = 100;
        let numberOfColumn = obj.isUPLSelected==false?(this.statusOptions.length + 1)>9?9:(this.statusOptions.length + 1):this.statusOptions.length>8?8:this.statusOptions.length;
        //let len = this.statusOptions.length>numberOfColumn?numberOfColumn:this.statusOptions.length;
       // let percentageUnit = Number(100 / len) != NaN ? Number(Number(100 / len)).toFixed(2) : 0;
        //console.log(`status Option length ${this.statusOptions.length} percentageUnit ${percentageUnit}`)
        
        if (obj.Indicate1 && obj.Competitor1) {
           let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate1;

            if(tempinitialPercentage<0)
            {
                obj.Indicate1=null;
             updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_1__c', value: obj.Indicate1 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
            }
            else{
            initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate1;
            }
       }
         
        if (obj.Indicate2 && obj.Competitor2) {
            
            let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate2;
            if(tempinitialPercentage<0)
            {
                obj.Indicate2=null;
               updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_2__c', value: obj.Indicate2 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
          }
          
          initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate2;
          
        }
        
        if (obj.Indicate3 && obj.Competitor3) {
            let  tempinitialPercentage= Number(initialPercentage).toFixed(2) - obj.Indicate3;
            if(tempinitialPercentage<0)
            {
                obj.Indicate3=null;
               updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_3__c', value: obj.Indicate3 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
          }
          else{
          initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate3;
          }
        }
        
        if (obj.Indicate4 && obj.Competitor4) {
            let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate4;
            if(tempinitialPercentage<0)
            {
                obj.Indicate4=null;
               updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_4__c', value: obj.Indicate4 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
          }
          initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate4;
        }
        
        if (obj.Indicate5 && obj.Competitor5) {
            let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate5;
            if(tempinitialPercentage<0)
            {
                obj.Indicate5=null;
               updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_5__c', value: obj.Indicate5 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
            }
            initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate5;
        }
        
        if (obj.Indicate6 && obj.Competitor6) {
            let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate6;
            if(tempinitialPercentage<0)
            {
                obj.Indicate6=null;
               updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_6__c', value: obj.Indicate6 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
            }
            initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate6;
        }
        
        if (obj.Indicate7 && obj.Competitor7) {
            let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate7;
            if(tempinitialPercentage<0)
            {
                obj.Indicate7=null;
               updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_7__c', value: obj.Indicate7 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
            }
            initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate7;
        }
        
        
        if (obj.Indicate8 && obj.Competitor8) {
            let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate8;
            if(tempinitialPercentage<0)
            {
                obj.Indicate8=null;
               updateGTMDetails({ recordId: obj.id, name:'Indicate_share_wallet_of_competitor_8__c', value: obj.Indicate8 }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
            }
            initialPercentage = Number(initialPercentage).toFixed(2) - obj.Indicate8;
        }
       
        if(obj.uplshare && obj.uplposition && obj.isUPLSelected==false){
            let  tempinitialPercentage = Number(initialPercentage).toFixed(2) - obj.uplshare;
            if(tempinitialPercentage<0)
            {
                obj.uplshare=null;
               updateGTMDetails({ recordId: obj.id, name:'UPLs_share_of_wallet__c', value: obj.uplshare }).then(data => {

               console.log('The new data is',data);
              });
              this.showToast('','Combined Total value more than 100% is not allowed','error','dismissable');
            }
            initialPercentage = Number(initialPercentage).toFixed(2) - obj.uplshare;
            //console.log('initialPercentage ',initialPercentage);
        }
      
        
        obj.remainingPercentage =Number(Number(initialPercentage).toFixed(2)).toLocaleString(this.countryLocale);
        console.log('obj ', obj);
        if (obj.remainingPercentage > 0) {
            obj.isDistributionCompleted = false;
        } else if (obj.remainingPercentage == 0) {
            obj.isDistributionCompleted = true;
           

        }
        

    }
    showToast(title,message,variant,mode) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: 'error',
			mode: mode
		});
		this.dispatchEvent(event);
	}


}