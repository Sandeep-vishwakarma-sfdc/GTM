import { LightningElement } from 'lwc';

export default class GtmFilterPanel extends LightningElement {
    value = 'None';
    value2 = 'Both';
    get options() {
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
}