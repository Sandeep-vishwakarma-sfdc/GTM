import { LightningElement, track, wire, api } from 'lwc';
import getFaq from '@salesforce/apex/GTMPathFinderHelper.getInstructions';

export default class GtmFaqs extends LightningElement {
    Faq='';

    @wire(getFaq) getFaq({error,data}){
        if(data){
            console.log('getFaq Data',data);
            this.Faq = data.Instruction_FAQ__c;
        }
    }
}