import { LightningElement,api,track } from 'lwc';

export default class PaginationCmp extends LightningElement {
    @track page = 1;
    startingRecord = 1;
    endingRecord = 0;
    pageSize = 10;
    totalRecordCount = 0;
    @track totalPage = 0;
    items = [];
    @track disableBtn = {first:false,previous:false,next:false,last:false};
    
    tabledata;
    data = [];
    @api get tabledata(){
      return this.items;  
    }


    set tabledata(value){
        if(value){
        this.data = JSON.parse(JSON.stringify(value));
        console.log('Pagination data ',this.data);
        this.totalRecordCount = this.data.length;
        this.totalPage = Math.ceil(this.totalRecordCount/this.pageSize);
        this.items = this.data.slice(0,this.pageSize);
        this.endingRecord = this.pageSize;
        console.log('Items ',this.items);
        let objlist = {values:this.items}
        setTimeout(() => {
            if(this.querySelector('.pagenumber')){
                this.querySelector('.pagenumber').innerHTML = `Page: ${this.page} of ${this.totalPage}`;
            }
        }, 500);
        this.checkNextPreviousbtn(this.page,this.totalPage);
        this.dispatchEvent(new CustomEvent('action',{detail:objlist}))
        }
    }
    
    get pageSizeOptions(){
        return [10,20,50,100];
    }

    handleRecordsPerPage(event){
        this.pageSize = event.target.value;
        this.page = 1;
        this.totalPage = Math.ceil(this.totalRecordCount/this.pageSize);
        this.displayRecordPerPage(this.page);
    }
    
    handlePrevious(){
        if(this.page>1){
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
    }
    handleNext(){
        if(this.page<this.totalPage && this.page!=this.totalPage){
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);
        }
    }

    handleFirst(){
        this.page = 1;
        this.displayRecordPerPage(this.page);
    }
    handleLast(){
        this.page = this.totalPage;
        this.displayRecordPerPage(this.page);
    }

    displayRecordPerPage(page){
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecordCount) 
                            ? this.totalRecordCount : this.endingRecord; 

        this.items = this.data.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
        let objlist = {values:this.items}
        if(this.querySelector('.pagenumber')){
            this.querySelector('.pagenumber').innerHTML = `Page: ${this.page} of ${this.totalPage}`;
        }
        this.checkNextPreviousbtn(this.page,this.totalPage);
        this.dispatchEvent(new CustomEvent('action',{detail:objlist}))
    }

    checkNextPreviousbtn(page,totalpage){
        if(totalpage>=page+1){
          this.disableBtn.next = false;
        }else{
            this.disableBtn.next = true;
        }
        if(page>1){
            this.disableBtn.previous = false;
        }else{
            this.disableBtn.previous = true;
        }
        if(page==1||page==0){
            this.disableBtn.first = true;
        }else{
            this.disableBtn.first = false;
        }
        if(page==totalpage){
            this.disableBtn.last = true;
        }else{
            this.disableBtn.last = false;
        }
      }
}