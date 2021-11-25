import { LightningElement } from 'lwc';

export default class GenericModelPopup extends LightningElement {
    hideModalBox(){
        this.dispatchEvent(new CustomEvent('close',{detail:false}))
    }
}