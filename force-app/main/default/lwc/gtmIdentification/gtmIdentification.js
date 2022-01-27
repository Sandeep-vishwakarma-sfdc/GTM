import { LightningElement,track,api,wire } from 'lwc';
import getGtm from '@salesforce/apex/GTMCompetition.getGtm';
import updateGTM from '@salesforce/apex/GTMCompetition.updateGTM';
import Name from '@salesforce/label/c.Name';
import Role from '@salesforce/label/c.Role';
import Email from '@salesforce/label/c.Email';
import Global_Client_Pathfinder_Program from '@salesforce/label/c.Global_Client_Pathfinder_Program';
import getSalesOrg from '@salesforce/apex/GTMPathFinder.getSalesOrg'
import getInstructions2 from '@salesforce/apex/GTMCompetition.getInstructions2';
import Please_fill_in_the_information_below_and_click_Next_to_start from '@salesforce/label/c.Please_fill_in_the_information_below_and_click_Next_to_start';


export default class GtmIdentification extends LightningElement {
 
    
    financialYear = '';

    set fiscalYear(value){
        if(value){
            this.financialYear = value;
            console.log('fiscal year ',this.financialYear);
        }
    }

    country = '';
    instrustions = '';
    @track labels = {
        Name : Name,
        Role : Role,
        Email : Email,
        Please_fill_in_the_information_below_and_click_Next_to_start:Please_fill_in_the_information_below_and_click_Next_to_start,
        Global_Client_Pathfinder_Program:Global_Client_Pathfinder_Program
        
    }

    @wire(getInstructions2)getInstruction({ error, data }) {
        if (data) {
            this.instrustions = data.Instruction_Identification__c;
        }
    }


    @track gtm=[];
    @api recordId;
    connectedCallback() {
        console.log('Fiscal Year ',this.financialYear);
     this.getGTMCompetitionApex();

     getSalesOrg().then(Name=>{
        console.log('The name is',Name.Name )
        this.country = Name.Name;
     });
    }
   





    getGTMCompetitionApex( ) {
        getGtm()
        .then((data) => {
            this.gtm=data;
            console.log('GTM  Details',data);
            
        })
        
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            console.log('Finally');
        })


        
    }

    handleInputChange(event )
    {
        console.log('detail value ', event.detail.value);
        let value=event.target.value;
        let id=event.currentTarget.dataset.id;
        let name=event.currentTarget.dataset.name;

        console.log(event.target.value);
        console.log('The id is',id);
        console.log('the name is',name);
        updateGTM({ recordId:id, name:name, value:value}).then(data=>{
            
            console.log('data updated',data); 
           

        });
        


        
    }
}