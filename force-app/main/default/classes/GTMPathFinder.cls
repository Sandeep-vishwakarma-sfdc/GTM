public with sharing class GTMPathFinder {

    // @AuraEnabled
    // public static List<PotentialAndProfile> getPotentialAndProfile(){
    //     try {
    //         List<PotentialAndProfile> pp = new List<PotentialAndProfile>();
    //         return pp;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    @AuraEnabled
    public static Map<string,List<GTM_Details__c>> getCatergoryAllocation(){
        String fiscalyear = String.valueOf(System.today().year())+ '-' +String.valueOf(System.today().year()+1);
        List<GTM_Details__c> gtmDetails = getGTMDetails(fiscalyear);
        if(gtmDetails.size()==0){
            gtmDetails = createGTMAndDetails(); 
        }
        System.debug('GTM Details'+gtmDetails);
        // [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,Product_Category__c,Product_Category__r.Name,Product_Category_Allocation__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:getSalesOrg().Id and GTM__r.Sales_Rep__c=:userInfo.getUserId()];
        Map<string,List<GTM_Details__c>> gtmProductAllocation= new Map<string,List<GTM_Details__c>>();
        List<ProductCategoryWrap> productCategoriesWrap =  new List<ProductCategoryWrap>();
        for(GTM_Details__c gtmd : gtmDetails){
            if(!gtmProductAllocation.containskey(gtmd.GTM_Customer__c)){
                
                List<GTM_Details__c> listGtms =  new List<GTM_Details__c>();
                listGtms.add(gtmd);
                Account acc = new Account();
                acc.Id = gtmd.GTM_Customer__c;
                acc.Name = gtmd.GTM_Customer__r.Name;
                
                gtmProductAllocation.put(gtmd.GTM_Customer__c,listGtms);
            }else{
                List<GTM_Details__c> listGtms =  new List<GTM_Details__c>();
                listGtms = gtmProductAllocation.get(gtmd.GTM_Customer__c);
                listGtms.add(gtmd);
                Account acc = new Account();
                acc.Id = gtmd.GTM_Customer__c;
                acc.Name = gtmd.GTM_Customer__r.Name;
                gtmProductAllocation.put(gtmd.GTM_Customer__c,listGtms);
            }
        }
        System.debug('----------> '+gtmProductAllocation);
        return gtmProductAllocation;
    }


    public static List<Account> getGTMCustomers(){ // GTMCustomer = Lead + Non-Lead Customer
        List<Account> gtmCustomers = new List<Account>();
        List<Account> leadCustomerList = new List<Account>();
        List<Account> nonLeadCustomerList = new List<Account>();
        Id leadcustomerRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Lead Customer').getRecordTypeId();
        Id nonleadcustomerRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Distributor').getRecordTypeId();
        System.debug('leadcustomerRecordType '+leadcustomerRecordType);
        if(Schema.sObjectType.Account.isAccessible()){
            // Getting Lead Customers by record type
            String qry = 'select Id,Name from Account where Sales_Org_Code__c=\''+getSalesOrg().Sales_Org_Code__c+'\'  and recordType.Id=\''+leadcustomerRecordType+'\' and Lead_Customer_Ownership__c=\''+userInfo.getUserId()+'\'';
            System.debug('Query '+qry);
            leadCustomerList = [select Id,Name from Account where Sales_Org_Code__c=:getSalesOrg().Sales_Org_Code__c  and recordType.Id=:leadcustomerRecordType and Lead_Customer_Ownership__c=:userInfo.getUserId()];
            System.debug('Lead Customer 42'+leadCustomerList);
            // Getting non-lead customer when lead customer field is empty
            nonLeadCustomerList = [select Id,Name from Account where Sales_Org_Code__c=:getSalesOrg().Sales_Org_Code__c and Account_Type__c='Sold To Party' and Lead_Customer__c=null and Lead_Customer_Ownership__c=:userInfo.getUserId() and recordTypeId=:nonleadcustomerRecordType];
            System.debug('non lead '+nonLeadCustomerList);
            System.debug('non Lead Customer 45'+leadCustomerList);
            gtmCustomers.addAll(leadCustomerList);
            gtmCustomers.addAll(nonLeadCustomerList);
            System.debug('GTM Customer 48'+gtmCustomers.size());
            return gtmCustomers;
        }
        System.debug(gtmCustomers);
        return gtmCustomers;
    }

    private static List<Product_Category__c> getActiveProductCategory(){
        List<Product_Category_Sales_Org_Mapping__c> productCategoryMapping = new List<Product_Category_Sales_Org_Mapping__c>();
        List<Product_Category__c> productCategories = new List<Product_Category__c>();
        if(Schema.sObjectType.Product_Category_Sales_Org_Mapping__c.isAccessible() && Schema.sObjectType.Product_Category__c.isAccessible()){
            productCategoryMapping = [select id,Name,Product_Category__c,Product_Category__r.Name from Product_Category_Sales_Org_Mapping__c where Status__c='Active' and Sales_Org__r.Sales_Org_Code__c=:getSalesOrg().Sales_Org_Code__c];
            List<String> productCategoriesId = new List<String>(); 
            for(Product_Category_Sales_Org_Mapping__c pcm:productCategoryMapping){
                Product_Category__c productCategory = new Product_Category__c();
                productCategory.Id = pcm.Product_Category__r.Id;
                productCategory.Name = pcm.Product_Category__r.Name;
                productCategories.add(productCategory);
            }
        }
        return productCategories;
    }

    private static List<GTM_Details__c> createGTMAndDetails(){
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();

        // Creating GTM
        GTM__c gtm = new GTM__c();
        String fiscalyear = String.valueOf(System.today().year())+ '-' +String.valueOf(System.today().year()+1);
        gtm.Fiscal_Year__c = fiscalyear;//TODO: Need to find solution later on
        gtm.GTM_Status__c = 'Draft';
        gtm.Sales_Org__c = getSalesOrg().Id;
        gtm.Sales_Rep__c = userInfo.getUserId();
        gtm.Sales_Rep_Name__c = userInfo.getName();
        //gtm.Role__c = userInfo.getUserRole(); TODO: Need to set user role using Query


        if(Schema.sObjectType.GTM__c.isCreateable()){
            System.debug('Create GTM');
            insert gtm;
        }else{
            System.debug('Please provide GTM__c Create Access to the profile');
        }

        //Creating GTM_Details__c
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Product Category Allocation').getRecordTypeId();
        System.debug('recordTypeProductCategory '+recordTypeProductCategory);
        System.debug('getGTMCustomers '+getGTMCustomers().size());
        System.debug('getActiveProductCategory '+getActiveProductCategory().size());
        for(Account acc:getGTMCustomers()){
            for(Product_Category__c pc:getActiveProductCategory()){
                System.debug('For loop Product_Category__c '+pc);
                GTM_Details__c gtmDetail = new GTM_Details__c();
                gtmDetail.recordTypeId = recordTypeProductCategory;
                gtmDetail.Product_Category__c = pc.Id;
                gtmDetail.GTM_Customer__c = acc.Id;
                gtmDetail.GTM__c = gtm.Id;
                gtmDetails.add(gtmDetail);
            }
        }
        if(Schema.sObjectType.GTM_Details__c.isCreateable()){
            System.debug('insert Details ');
            insert gtmDetails;
        }else{
            System.debug('Please provide GTM_Details__c Create Access to the profile');
        } 
    return getGTMDetails(fiscalyear);
    }

    public static Sales_Org__c getSalesOrg(){
        String country = '';
        Sales_Org__c salesorg;
        Login_Country__c loginCountry = null;
        User usr;
        if(Schema.sObjectType.User.isAccessible()){
          usr = [Select Id,Name,Country from User where id=:userInfo.getUserId()];
        }
         if(usr!=null){
            country =  usr.Country;
         }
         if(Schema.sObjectType.Login_Country__c.isAccessible()){
            loginCountry = [Select id,Name,Sales_Org_Code__c from Login_Country__c where Name=:country];
         }
         if(loginCountry!=null && Schema.sObjectType.Sales_Org__c.isAccessible()){
             System.debug('getSalesOrg '+loginCountry.Sales_Org_Code__c);
            salesorg = [Select id,Name,Sales_Org_Code__c from Sales_Org__c where Sales_Org_Code__c=:loginCountry.Sales_Org_Code__c];
        }
        return salesorg;
    }

    private static List<GTM_Details__c> getGTMDetails(String fiscalyear){
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,Product_Category__c,Product_Category__r.Name,Product_Category_Allocation__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:getSalesOrg().Id and GTM__r.Sales_Rep__c=:userInfo.getUserId()];

        System.debug('gtmDetails '+gtmDetails.size());
        if(gtmDetails.size()>0){
            return gtmDetails;
        }
        return gtmDetails;
    }
    
    @AuraEnabled
    public static String getFiscalYear(){
        list<Period> listOfPeriod = new list<Period>();
        if(Schema.sObjectType.Period.isAccessible()){
        listOfPeriod = [SELECT FiscalYearSettings.Name , StartDate,EndDate, type FROM Period WHERE Type = 'Year' AND StartDate <= TODAY AND EndDate >= TODAY limit 1];
        }
        if(listOfPeriod.size()>0){
            String startYear = String.valueOf(listOfPeriod[0].StartDate.year());
            String endYear = String.valueOf(listOfPeriod[0].EndDate.year());
            String fiscalyear = startYear+'-'+endYear;
            return fiscalyear;
        }
        return '';
    }
    class ProductCategoryWrap{
        @AuraEnabled public Account acc;
        @AuraEnabled public List<GTM_Details__c> gtmDetails;
        ProductCategoryWrap(Account acc,List<GTM_Details__c> gtmDetails){
            this.acc = acc;
            this.gtmDetails = gtmDetails;
        }
    }
}
