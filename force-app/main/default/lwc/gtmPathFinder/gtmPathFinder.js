import { LightningElement, track } from 'lwc';


export default class GtmPathFinder extends LightningElement {
    @track isShowModal = false;
    value = 'No. of Lead Customer';

    accounts = [];

    handlePaginationAction() { }

    value2 = 'Both';

    get options() {
        return [
            { label: 'Lead Customer', value: 'Lead Customer' },
            { label: 'Non Lead Customer', value: 'Non Lead Customer' },
            { label: 'Both', value: 'Both' },
        ];
    }

    value = 'None';

    get options2() {
        return [
            { label: 'Not Fill', value: 'Not Fill' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'None', value: 'None' },

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
    handleChange(event) {
        this.show = event.target.checked;
    }

    activeSections = ['A', 'B'];
    activeSectionsMessage = '';

  

    handleclick() {
        let ml = this.template.querySelector(".sidebar");
        ml.toggleClass("active");
    }
    showModalBox() {
        this.isShowModal = true;
    }

    hideModalBox(event) {
        console.log('Event detail ',event.detail)
        this.isShowModal = false;
    }

    handleModelSubmit(){
        console.log('Submit model');
        this.isShowModal = false;
    }

}