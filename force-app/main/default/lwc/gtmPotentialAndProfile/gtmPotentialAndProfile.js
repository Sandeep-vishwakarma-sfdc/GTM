import { LightningElement,track } from 'lwc';

export default class GtmPotentialAndProfile extends LightningElement {
    
    @track gtmPotentialProfile;
    @track paginatedGtmPotentialProfile

    get customerTypeOption(){
        return [
            { label: 'Customer Type is Already Correct', value: 'Customer_Type_is_Already_Correct' },
            { label: 'Distributor', value: 'Distributor' },
            { label: 'Retailer', value: 'Retailer' },
            { label: 'B2B', value: 'B2B' },
            { label: 'Dealer', value: 'Dealer' },
        ];
    }

    @track panelStatus={
        notFilled:'05',
        inProgress:'20',
        completed:'10'
    }

    connectedCallback(){
        this.gtmPotentialProfile = [
            {id:1,account:{id:1,name:'ACEITERA GENERAL DEHEZA S.A.'},customerType:'Distributor',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:2,account:{id:1,name:'ENRIQUE M. BAYA CASAL S.A.'},customerType:'Distributor',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:3,account:{id:1,name:'LOS GROBO AGROPECUARIA S.A.'},customerType:'Dealer & Retail',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:4,account:{id:1,name:'CAMBIAGNO GABRIEL ANDRES'},customerType:'Distributor',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:5,account:{id:1,name:'NOVOZYMES BIOAG S.A.'},customerType:'B2B',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:6,account:{id:1,name:'LARTIRIGOYEN Y CIA. S.A.'},customerType:'Distributor',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:7,account:{id:1,name:'AGRICULTORES FEDERADOS ARGENTI'},customerType:'B2B',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:8,account:{id:1,name:'SUMITOMO CHEMICAL ARGENTINA S.A.'},customerType:'B2B',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:9,account:{id:1,name:'AGROEMPRESA COLON S.A.'},customerType:'Distributor',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:10,account:{id:1,name:'NOVOZYMES BIOAG S.A.'},customerType:'B2B',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:11,account:{id:1,name:'LARTIRIGOYEN Y CIA. S.A.'},customerType:'Distributor',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:12,account:{id:1,name:'AGRICULTORES FEDERADOS ARGENTI'},customerType:'B2B',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:13,account:{id:1,name:'SUMITOMO CHEMICAL ARGENTINA S.A.'},customerType:'B2B',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''},
            {id:14,account:{id:1,name:'AGROEMPRESA COLON S.A.'},customerType:'Distributor',total_Purcahse_of_Crop_Protection:'',estimated_Markup_of_Channel:'',estimated_number_of_Sales_REP:'',number_of_Stories:''}
        ];

            this.panelStatus = {
                notFilled:'05',
                inProgress:'50',
                completed:'10'
            }
            
            console.log('timeout',this.panelStatus);
    }

    handleFiltersAction(event){
        console.log('filter action ',event.detail)
    }

    handlePaginationAction(event){
        this.paginatedGtmPotentialProfile = event.detail.values;
    }
    handleCustomerTypeChange(event){
        console.log(event.target.value);
    }
}