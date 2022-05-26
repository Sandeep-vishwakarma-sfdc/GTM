import { LightningElement, track } from 'lwc';
import { loadStyle , loadScript} from 'lightning/platformResourceLoader';
import jquerymin from '@salesforce/resourceUrl/jquerymin';
import sidebarjs from '@salesforce/resourceUrl/sidebarjs';

export default class gTM_argentina extends LightningElement {

    @track isShowModal = false;
    value = 'No. of Lead Customer';

    accounts=[];

    renderedCallback() {
        Promise.all([
            loadScript( this, jquerymin),
            loadScript( this, sidebarjs),
        ])
    }

    
    handlePaginationAction (){}

    value2 = 'Both';

    get options() {
        return [
            { label: 'Lead Customer', value: 'Lead Customer'  },
            { label: 'Non Lead Customer', value: 'Non Lead Customer' },
            { label: 'Both', value: 'Both' },
           
        ];
    }

    value = 'None';

    get options2() {
        return [
            { label: 'Not Filled', value: 'Not Filled' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'None', value: 'None' },
           
        ];
    }

    value3 = 'Both';

    get options3() {
        return [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
            { label: 'Both', value: 'Both' },
           
           
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }


    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

    show = true;
    handleChange(event){
        this.show = event.target.checked;
    }
    
    activeSections = ['A','B'];
    activeSectionsMessage = '';

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }

handleclick(){
    let ml=this.template.querySelector(".sidebar");
    ml.toggleClass("active");
}

@track isShowModal = false;

showModalBox() {  
    this.isShowModal = true;
}

hideModalBox() {  
    this.isShowModal = false;
}

    
}