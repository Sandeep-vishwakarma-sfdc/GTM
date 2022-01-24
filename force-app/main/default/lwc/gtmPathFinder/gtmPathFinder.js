import { LightningElement, track } from 'lwc';
import getFiscalYear from '@salesforce/apex/GTMPathFinder.getFiscalYear'
import Submit from '@salesforce/label/c.Submit'
import Cancel from '@salesforce/label/c.Cancel'
import Currency_in_USD_Amount_in_Million from '@salesforce/label/c.Currency_in_USD_Amount_in_Million';
import Entered_data_auto_save_into_the_system from '@salesforce/label/c.Entered_data_auto_save_into_the_system';
import Instructions from '@salesforce/label/c.Instructions';
import GTM_FY from '@salesforce/label/c.CLIENT_PATHFINDER';
import OUTLOOK from '@salesforce/label/c.OUTLOOK';
import IDENTIFICATION from '@salesforce/label/c.IDENTIFICATION';
import COMPETITION from '@salesforce/label/c.COMPETITION';
import FAQ from '@salesforce/label/c.FAQ';
import CATEGORY_ALLOCATION from '@salesforce/label/c.CATEGORY_ALLOCATION';
import CROP_ALLOCATION from '@salesforce/label/c.CROP_ALLOCATION';
import POTENTIAL_AND_PROFILE from '@salesforce/label/c.POTENTIAL_AND_PROFILE';
import getPotentialAndProfile from '@salesforce/apex/GTMPathFinder.getPotentialAndProfile';
import getCatergoryAllocation from '@salesforce/apex/GTMPathFinder.getCatergoryAllocation';
import getCropAllocation from '@salesforce/apex/GTMPathFinder.getCropAllocation';
import getGTMCompetition from '@salesforce/apex/GTMCompetition.getGTMCompetition';
import getGTMOutlook from '@salesforce/apex/GTMOutlook.getGTMOutlook';
import getNewGTMCustomers from '@salesforce/apex/GTMPathFinder.getNewGTMCustomers';
import createNewCustomerDetails from '@salesforce/apex/GTMPathFinder.createNewCustomerDetails';
import getNewlyAddedCrop from '@salesforce/apex/GTMPathFinder.getNewlyAddedCrop';
import createGTMAndDetailsCropAllocation from '@salesforce/apex/GTMPathFinder.createGTMAndDetailsCropAllocation';
import submitGTMDetails from '@salesforce/apex/GTMPathFinder.submitGTMDetails';

export default class GtmPathFinder extends LightningElement {
    @track isShowModal = false;
    title = '';

    labels = {
        Submit,
        Cancel,
        Currency_in_USD_Amount_in_Million,
        Entered_data_auto_save_into_the_system,
        Instructions,
        GTM_FY,
        OUTLOOK,
        IDENTIFICATION,
        COMPETITION,
        FAQ,
        CATEGORY_ALLOCATION,
        CROP_ALLOCATION,
        POTENTIAL_AND_PROFILE
    }


    connectedCallback(){
        getFiscalYear().then(year=>{
            let title = year.replace('/','-');
            this.title = `${this.labels.GTM_FY} ${title}`;
        })

        this.init();

        getNewGTMCustomers().then(newAccounts=>{
            if(newAccounts.length>0){
                console.log('new Accounts',newAccounts);
                createNewCustomerDetails({newAccounts:JSON.stringify(newAccounts)}).then(data=>{
                });
            }
        });

        getNewlyAddedCrop().then(listCrop=>{
            console.log('New Crops ',listCrop);
            if(listCrop.length>0){
                createGTMAndDetailsCropAllocation({activeCrops:listCrop}).then(data=>{}).catch(err=>{console.log('createGTMAndDetailsCropAllocation ',err)})
            }
        }).catch(err=>console.log('getNewlyAddedCrop ',getNewlyAddedCrop))
       
    }

    async init() {
        try {
            await getPotentialAndProfile().catch(err=>console.log(err));
            await getCatergoryAllocation().catch(err=>console.log(err));
            await getCropAllocation().catch(err=>console.log(err));
            await getGTMCompetition().catch(err=>console.log(err));
            await getGTMOutlook().catch(err=>console.log(err));
        } catch (error) {
                console.log('error ',error);
        } finally {
            console.log('init completed')
        }
    }

    onTabChange(event){
        let cmpName = event.target.name;
        let cmp = this.template.querySelector(`${cmpName}`);
        if(cmp){
            cmp.onTabRefresh();
            cmp = undefined;
        }
    }
    
    handleclick() {
        let ml = this.template.querySelector(".sidebar");
        ml.toggleClass("active");
    }
    showModalBox() {
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }
    

    handleModelSubmit(){
        console.log('Submit model');
        this.isShowModal = false;
        this.submitDetails();
    }

    submitDetails(){
        submitGTMDetails().then(isSubmitted=>{
            console.log('isSubmitted ',isSubmitted);
        })
    }

}