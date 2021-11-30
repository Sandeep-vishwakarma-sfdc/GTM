import { LightningElement,track,api } from 'lwc';

export default class GtmFilterPanel extends LightningElement {
    @track panelStatusObj={
        notFilled:'05',
        inProgress:'10',
        completed:'20'
    }
    @api get panelStatus(){
        return this.panelStatusObj;
    }
    set panelStatus(value){
        // console.log('values to set',value.inProgress)
        setTimeout(() => {
            if(value){
                this.panelStatusObj.notFilled = value.notFilled;
                this.panelStatusObj.inProgress = value.inProgress;
                this.panelStatusObj.completed = value.completed;
            }
        }, 1000);
    }
    @track filters = {
        search:'',
        filter1:'',
        filter2:''
    }
    get options1() {
        return [
            { label: 'Lead Customer', value: 'Lead Customer'  },
            { label: 'Non Lead Customer', value: 'Non Lead Customer' },
            { label: 'Both', value: 'Both' },
        ];
    }
    get options2() {
        return [
            { label: 'Not Fill', value: 'Not Fill' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
            { label: 'None', value: 'None' },
        ];
    }

    connectedCallback(){
        // this.dispatchAllevents();
    }

    handleValueChange(event){
        if(event.target.name=='search'){
            this.filters.search = event.target.value;
        }
        if(event.target.name=='filter1'){
            this.filters.filter1 = event.target.value;
        }
        if(event.target.name=='filter2'){
            this.filters.filter2 = event.target.value;
        }
        // console.log('filters ',this.filters);
        this.dispatchAllevents();
    }

    dispatchAllevents(){
        console.log('event dispatched');
        this.dispatchEvent(new CustomEvent('action',{detail:this.filters}));
    }
}