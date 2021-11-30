import { LightningElement } from 'lwc';

export default class GenericModelPopup extends LightningElement {
    closeModalBox(){
        this.dispatchEvent(new CustomEvent('close',{detail:false}))
    }
    handleModelsubmit(){
        this.dispatchEvent(new CustomEvent('modelsubmit',{detail:false}))
    }
}