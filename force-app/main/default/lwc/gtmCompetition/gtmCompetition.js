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


export default class GtmCompetition extends LightningElement {
    // 29/12/2021

    @track labels = {
        Customer_Lead_Customer: Customer_Lead_Customer,
        Write_UPL_POSITION: Write_UPL_POSITION,
        UPL_s_Share_of_Wallet: UPL_s_Share_of_Wallet,
        Remaining: Remaining,
        Check_If_Distribution_Is_Correct: Check_If_Distribution_Is_Correct,

        Write_the_name_of_the_1_Company1: Write_the_name_of_the_1_Company.split('<br/>')[0],
        Write_the_name_of_the_1_Company2: Write_the_name_of_the_1_Company.split('<br/>')[1],

        Indicate_the_Share_of_Wallet_of_the_1_Company1: Indicate_the_Share_of_Wallet_of_the_1_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_1_Company2: Indicate_the_Share_of_Wallet_of_the_1_Company.split('<br/>')[1],

        Write_the_name_of_the_2_Company1: Write_the_name_of_the_2_Company.split('<br/>')[0],
        Write_the_name_of_the_2_Company2: Write_the_name_of_the_2_Company.split('<br/>')[1],

        Indicate_the_Share_of_Wallet_of_the_2_Company1: Indicate_the_Share_of_Wallet_of_the_2_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_2_Company2: Indicate_the_Share_of_Wallet_of_the_2_Company.split('<br/>')[1],
        Write_the_name_of_the_3_Company1: Write_the_name_of_the_3_Company.split('<br/>')[0],
        Write_the_name_of_the_3_Company2: Write_the_name_of_the_3_Company.split('<br/>')[1],
        Indicate_the_Share_of_Wallet_of_the_3_Company1: Indicate_the_Share_of_Wallet_of_the_3_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_3_Company2: Indicate_the_Share_of_Wallet_of_the_3_Company.split('<br/>')[1],
        Write_the_name_of_the_4_Company1: Write_the_name_of_the_4_Company.split('<br/>')[0],
        Write_the_name_of_the_4_Company2: Write_the_name_of_the_4_Company.split('<br/>')[1],
        Indicate_the_Share_of_Wallet_of_the_4_Company1: Indicate_the_Share_of_Wallet_of_the_4_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_4_Company2: Indicate_the_Share_of_Wallet_of_the_4_Company.split('<br/>')[1],

        Write_the_name_of_the_5_Company1: Write_the_name_of_the_5_Company.split('<br/>')[0],
        Write_the_name_of_the_5_Company2: Write_the_name_of_the_5_Company.split('<br/>')[1],
        Indicate_the_Share_of_Wallet_of_the_5_Company1: Indicate_the_Share_of_Wallet_of_the_5_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_5_Company2: Indicate_the_Share_of_Wallet_of_the_5_Company.split('<br/>')[1],

        Write_the_name_of_the_6_Company1: Write_the_name_of_the_6_Company.split('<br/>')[0],
        Write_the_name_of_the_6_Company2: Write_the_name_of_the_6_Company.split('<br/>')[1],
        Indicate_the_Share_of_Wallet_of_the_6_Company1: Indicate_the_Share_of_Wallet_of_the_6_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_6_Company2: Indicate_the_Share_of_Wallet_of_the_6_Company.split('<br/>')[1],

        Write_the_name_of_the_7_Company1: Write_the_name_of_the_7_Company.split('<br/>')[0],
        Write_the_name_of_the_7_Company2: Write_the_name_of_the_7_Company.split('<br/>')[1],
        Indicate_the_Share_of_Wallet_of_the_7_Company1: Indicate_the_Share_of_Wallet_of_the_7_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_7_Company2: Indicate_the_Share_of_Wallet_of_the_7_Company.split('<br/>')[1],

        Write_the_name_of_the_8_Company1: Write_the_name_of_the_8_Company.split('<br/>')[0],
        Write_the_name_of_the_8_Company2: Write_the_name_of_the_8_Company.split('<br/>')[1],
        Indicate_the_Share_of_Wallet_of_the_8_Company1: Indicate_the_Share_of_Wallet_of_the_8_Company.split('<br/>')[0],
        Indicate_the_Share_of_Wallet_of_the_8_Company2: Indicate_the_Share_of_Wallet_of_the_8_Company.split('<br/>')[1],
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
    @track hasOptionsAdded = false;

    @wire(getInstructions1) getInstruction({ error, data }) {
        if (data) {
            this.instrustions = data.Instruction_Competitor__c;
        }
    }

    @track sortDirection = true;

    value = 'new';
    statusOptions = [];

    //
    @api onTabRefresh() {
        setTimeout(() => {
            this.hasOptionsAdded = true;
            this.connectedCallback();
        }, 500);
    }

    connectedCallback() {

        Promise.all([getCompetitorDetails(), getGTMCompetition()]).then(result => {
            let data = [];
            if (result.length == 2) {
                result[0].forEach(element => {
                    console.log('element', element);
                    let obj = { label: element.Name, value: element.Id };
                    if (!this.hasOptionsAdded) {
                        this.statusOptions.push(obj);
                    }
                });
                if (!this.hasOptionsAdded) {
                    let objNone = { label: 'None', value: "" };
                    // this.statusOptions.push(objNone);
                }
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
                        isLeadCustomer: ele.GTM_Customer__r.Lead_Customer__c ? true : false,
                        //8/1/2022
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
                        this.handleChangeStatusOnLoad(ele.id);
                        this.updateStatusLabel();
                    })
                }, 200);
                console.log('Competitior  data ', this.gtmcompetitor);
            }
        })
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
        if (value == '') {
            value = 0;
        }

        updateGTMDetails({ recordId: id, name: name, value: value }).then(data => {

            console.log('data updated', data);

        });
        let gtmIndex = this.gtmcompetitor.findIndex((obj => obj.id == id));
        if (name == 'Competitor_Name_1__c') {
            console.log('Competitor_Name_1__c');
            this.gtmcompetitor[gtmIndex].Competitor1 = value;
            this.gtmcompetitor[gtmIndex].Competitor1Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
            
        }
        else if (name == 'Indicate_share_wallet_of_competitor_1__c') {
            console.log('Indicate_share_wallet_of_competitor_1__c');
            this.gtmcompetitor[gtmIndex].Indicate1 = value;
        }
        else if (name == 'Competitor_Name_2__c') {
            console.log('Competitor_Name_2__c');
            this.gtmcompetitor[gtmIndex].Competitor2 = value;
            this.gtmcompetitor[gtmIndex].Competitor2Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        } else if (name == 'Indicate_share_wallet_of_competitor_2__c') {
            console.log('Indicate_share_wallet_of_competitor_2__c');
            this.gtmcompetitor[gtmIndex].Indicate2 = value;
        } else if (name == 'Competitor_Name_3__c') {
            console.log('Competitor_Name_3__c');
            this.gtmcompetitor[gtmIndex].Competitor3 = value;
            this.gtmcompetitor[gtmIndex].Competitor3Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        } else if (name == 'Indicate_share_wallet_of_competitor_3__c') {
            console.log('Indicate_share_wallet_of_competitor_3__c');
            this.gtmcompetitor[gtmIndex].Indicate3 = value;
        } else if (name == 'Competitor_Name_4__c') {
            console.log('Competitor_Name_4__c');
            this.gtmcompetitor[gtmIndex].Competitor4 = value;
            this.gtmcompetitor[gtmIndex].Competitor4Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        } else if (name == 'Indicate_share_wallet_of_competitor_4__c') {
            console.log('Indicate_share_wallet_of_competitor_4__c');
            this.gtmcompetitor[gtmIndex].Indicate4 = value;
            
        } else if (name == 'Competitor_Name_5__c') {
            console.log('Competitor_Name_5__c');
            this.gtmcompetitor[gtmIndex].Competitor5 = value;
            this.gtmcompetitor[gtmIndex].Competitor5Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        } else if (name == 'Indicate_share_wallet_of_competitor_5__c') {
            console.log('Indicate_share_wallet_of_competitor_5__c');
            this.gtmcompetitor[gtmIndex].Indicate5 = value;
        }
        else if (name == 'Competitor_Name_6__c') {
            console.log('Competitor_Name_6__c');
            this.gtmcompetitor[gtmIndex].Competitor6 = value;
            this.gtmcompetitor[gtmIndex].Competitor6Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        } else if (name == 'Indicate_share_wallet_of_competitor_6__c') {
            console.log('Indicate_share_wallet_of_competitor_6__c');
            this.gtmcompetitor[gtmIndex].Indicate6 = value;
        } else if (name == 'Competitor_Name_7__c') {
            console.log('Competitor_Name_7__c');
            this.gtmcompetitor[gtmIndex].Competitor7 = value;
            this.gtmcompetitor[gtmIndex].Competitor7Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        } else if (name == 'Indicate_share_wallet_of_competitor_7__c') {
            console.log('Indicate_share_wallet_of_competitor_7__c');
            this.gtmcompetitor[gtmIndex].Indicate7 = value;
        } else if (name == 'Competitor_Name_8__c') {
            console.log('Competitor_Name_8__c');
            this.gtmcompetitor[gtmIndex].Competitor8 = value;
            this.gtmcompetitor[gtmIndex].Competitor8Name = this.statusOptions.filter(op=>String(op.value)==String(value))[0].label;
        } else if (name == 'Indicate_share_wallet_of_competitor_8__c') {
            console.log('Indicate_share_wallet_of_competitor_8__c');
            this.gtmcompetitor[gtmIndex].Indicate8 = value;
        } else if (name == 'UPL_Position__c') {
            console.log('UPL_Position__c');
            this.gtmcompetitor[gtmIndex].uplposition = value;
        } else if (name == 'UPLs_share_of_wallet__c') {
            console.log('UPLs_share_of_wallet__c');
            this.gtmcompetitor[gtmIndex].uplshare = value;
        }
        this.updatePicklistOptions(this.gtmcompetitor[gtmIndex])
        setTimeout(() => {
            let tempData = JSON.parse(JSON.stringify(this.gtmcompetitor));
            this.gtmcompetitor = tempData;
            this.gtmcompetitor1 = this.gtmcompetitor;
            this.handleChangeStatusOnLoad(id);
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

    handleChangeStatusOnLoad(id, value) {
        console.log('id ', id);
        
        
    }

    // Today 7/01/2022

    mapCustomerCategory(gtmcompetitor, id) {
        let masterObj = {};
        let arr = [];
        let percentage = 100
        productAllocation.forEach(ele => {
            if (ele.GTM_Customer__c == id) {
                percentage = Number(percentage) - Number(ele.Competitor__c);
                let percentageLabel = '';
                if (percentage == 0) {
                    percentageLabel = 'Completed';
                } else if (percentage > 0 && percentage < 100) {
                    percentageLabel = 'In Progress';
                } else if (percentage == 100) {
                    percentageLabel = 'Not Fill';
                }
                console.log('percenatge ', percentage);
                //let obj = {'pId':ele.Product_Category__r.Id,'pName':ele.Product_Category__r.Name,'GTMDetail':ele.Id,'allocation':ele.Product_Category_Allocation__c};
                //rr.push(obj)
                masterObj = { id: ele.GTM_Customer__c, 'isLeadCustomer': ele.GTM_Customer__r.Lead_Customer__c ? true : false, percentage: percentageLabel, percentageValue: percentage };
            }
        })
        console.log('Master obj ', masterObj)
        return masterObj;
    }
    getCalculatedPercentage() {
        this.gtmcompetitorVirtual.forEach((ele) => {
            let percentage = 100;
            ele.productCategory.forEach(e => {
                percentage = Number(percentage) - Number(e.allocation);
                // console.log('cal percenatge ',percentage);
            })
            let percentageLabel = '';
            if (percentage == 0) {
                percentageLabel = 'Completed';
            } else if (percentage > 0 && percentage < 100) {
                percentageLabel = 'In Progress';
            } else if (percentage == 100) {
                percentageLabel = 'Not Fill';
            }
            setTimeout(() => {
                ele.percentage = percentageLabel;
                ele.percentageValue = percentage;
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
                    col.firstChild.data = `${Number(inputCompleted).toFixed(2)} %`;
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






    // Today 7/07/2022





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
        this.gtmcompetitorVirtual.forEach(ele => {
            this.handleChangeStatusOnLoad(ele.id);
        })
        this.gtmcompetitor1 = JSON.parse(JSON.stringify(this.gtmcompetitor));
        setTimeout(() => {
            this.updateStatusLabel();
        }, 200);
    }

    updatePicklistOptions(obj) {

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
        }else{
            obj.isUPLSelected=false
        }
        let initialPercentage = 100;
        let numberOfColumn = obj.isUPLSelected==false?(this.statusOptions.length + 1)>9?9:(this.statusOptions.length + 1):this.statusOptions.length>8?8:this.statusOptions.length;
        let len = this.statusOptions.length>numberOfColumn?numberOfColumn:this.statusOptions.length;
        let percentageUnit = Number(100 / len) != NaN ? Number(Number(100 / len)).toFixed(2) : 0;
        console.log(`status Option length ${this.statusOptions.length} percentageUnit ${percentageUnit}`)
        console.log('obj ', obj);
        if (obj.Competitor1) {
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if (obj.Competitor2) {
            
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if (obj.Competitor3) {
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if (obj.Competitor4) {
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if (obj.Competitor5) {
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if (obj.Competitor6) {
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if (obj.Competitor7) {
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if (obj.Competitor8) {
            initialPercentage = Number(initialPercentage).toFixed(2) - percentageUnit;
        }
        if(obj.uplposition && obj.isUPLSelected==false){
            initialPercentage = Number(initialPercentage).toFixed(2) - Number(percentageUnit).toFixed(2);
            console.log('initialPercentage ',initialPercentage);
        }
        obj.remainingPercentage = Number(initialPercentage).toFixed(1);
        if (obj.remainingPercentage > 0) {
            obj.isDistributionCompleted = false;
        } else if (obj.remainingPercentage == 0) {
            obj.isDistributionCompleted = true;
        }
        

    }

}