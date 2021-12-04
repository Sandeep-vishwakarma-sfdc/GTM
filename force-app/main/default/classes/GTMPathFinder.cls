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
        String fiscalyear = getFiscalYear();
        List<GTM_Details__c> gtmDetails = getGTMDetailsProduct(fiscalyear);
        if(gtmDetails.size()==0){
            gtmDetails = createGTMAndDetailsProductAllocation(); 
        }
        System.debug('GTM Details'+gtmDetails);
        Map<string,List<GTM_Details__c>> gtmProductAllocation= new Map<string,List<GTM_Details__c>>();
        for(GTM_Details__c gtmd : gtmDetails){
            if(!gtmProductAllocation.containskey(gtmd.GTM_Customer__c)){
                
                List<GTM_Details__c> listGtms =  new List<GTM_Details__c>();
                listGtms.add(gtmd);
                Account acc = new Account();
                acc.Id = gtmd.GTM_Customer__c;
                acc.Name = gtmd.GTM_Customer__r.Name;
                acc.Lead_Customer__c = gtmd.GTM_Customer__r.Lead_Customer__c;
                
                gtmProductAllocation.put(gtmd.GTM_Customer__c,listGtms);
            }else{
                List<GTM_Details__c> listGtms =  new List<GTM_Details__c>();
                listGtms = gtmProductAllocation.get(gtmd.GTM_Customer__c);
                listGtms.add(gtmd);
                Account acc = new Account();
                acc.Id = gtmd.GTM_Customer__c;
                acc.Name = gtmd.GTM_Customer__r.Name;
                acc.Lead_Customer__c = gtmd.GTM_Customer__r.Lead_Customer__c;
                gtmProductAllocation.put(gtmd.GTM_Customer__c,listGtms);
            }
        }
        System.debug('----------> '+gtmProductAllocation);
        return gtmProductAllocation;
    }

    @AuraEnabled
    public static Map<string,List<GTM_Details__c>> getCropAllocation(){
        String fiscalyear = getFiscalYear();
        List<GTM_Details__c> gtmDetails = getGTMDetailsCrop(fiscalyear);
        if(gtmDetails.size()==0){
            gtmDetails = createGTMAndDetailsCropAllocation(); 
        }
        System.debug('GTM Details'+gtmDetails);
        Map<string,List<GTM_Details__c>> gtmCropAllocation= new Map<string,List<GTM_Details__c>>();
        for(GTM_Details__c gtmd : gtmDetails){
            if(!gtmCropAllocation.containskey(gtmd.GTM_Customer__c)){
                
                List<GTM_Details__c> listGtms =  new List<GTM_Details__c>();
                listGtms.add(gtmd);
                Account acc = new Account();
                acc.Id = gtmd.GTM_Customer__c;
                acc.Name = gtmd.GTM_Customer__r.Name;
                acc.Lead_Customer__c = gtmd.GTM_Customer__r.Lead_Customer__c;
                
                gtmCropAllocation.put(gtmd.GTM_Customer__c,listGtms);
            }else{
                List<GTM_Details__c> listGtms =  new List<GTM_Details__c>();
                listGtms = gtmCropAllocation.get(gtmd.GTM_Customer__c);
                listGtms.add(gtmd);
                Account acc = new Account();
                acc.Id = gtmd.GTM_Customer__c;
                acc.Name = gtmd.GTM_Customer__r.Name;
                acc.Lead_Customer__c = gtmd.GTM_Customer__r.Lead_Customer__c;
                gtmCropAllocation.put(gtmd.GTM_Customer__c,listGtms);
            }
        }
        System.debug('----------> '+gtmCropAllocation);
        return gtmCropAllocation;
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
            leadCustomerList = [select Id,Name from Account where Sales_Org_Code__c=:getSalesOrg().Sales_Org_Code__c  and recordType.Id=:leadcustomerRecordType and Lead_Customer_Ownership__c=:userInfo.getUserId()];
            System.debug('Lead Customer 42'+leadCustomerList);
            // Getting non-lead customer when lead customer field is empty
            nonLeadCustomerList = [select Id,Name from Account where Sales_Org_Code__c=:getSalesOrg().Sales_Org_Code__c and Account_Type__c='Sold To Party' and Lead_Customer__c=null and Lead_Customer_Ownership__c=:userInfo.getUserId() and recordTypeId=:nonleadcustomerRecordType];
            System.debug('non lead '+nonLeadCustomerList);
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

    private static List<GTM_Details__c> createGTMAndDetailsProductAllocation(){
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        String fiscalyear = getFiscalYear();
        Sales_Org__c salesOrg = getSalesOrg();
        Id userId = userInfo.getUserId();
        List<GTM__c> gtms = new  List<GTM__c>();
        if(Schema.sObjectType.GTM__c.isAccessible()){
            gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
        }
        User userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
        GTM__c gtm = new GTM__c();
        if(gtms.size()==0){
            gtm.Fiscal_Year__c = fiscalyear;
            gtm.GTM_Status__c = 'Draft';
            gtm.Sales_Org__c = salesOrg.Id;
            gtm.Sales_Rep__c = userInfo.getUserId();
            gtm.Sales_Rep_Name__c = userInfo.getName();
            gtm.Role__c = userDetails.UserRole.Name;
            if(Schema.sObjectType.GTM__c.isCreateable()){
                System.debug('Create GTM');
                insert gtm;
                gtms.add(gtm);
            }else{
                System.debug('Please provide GTM__c Create Access to the profile');
            }
        }
        //Creating GTM_Details__c
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Product Category Allocation').getRecordTypeId();
        System.debug('recordTypeProductCategory '+recordTypeProductCategory);
        for(Account acc:getGTMCustomers()){
            for(Product_Category__c pc:getActiveProductCategory()){
                System.debug('For loop Product_Category__c '+pc);
                GTM_Details__c gtmDetail = new GTM_Details__c();
                gtmDetail.recordTypeId = recordTypeProductCategory;
                gtmDetail.Product_Category__c = pc.Id;
                gtmDetail.Product_Category_Allocation__c = 0;
                gtmDetail.GTM_Customer__c = acc.Id;
                gtmDetail.Sales_Org__c = salesOrg.Id;
                gtmDetail.GTM__c = gtms[0].Id;
                gtmDetails.add(gtmDetail);
            }
        }
        if(Schema.sObjectType.GTM_Details__c.isCreateable()){
            System.debug('insert Details ');
            insert gtmDetails;
        }else{
            System.debug('Please provide GTM_Details__c Create Access to the profile');
        } 
    return getGTMDetailsProduct(fiscalyear);
    }

    private static List<GTM_Details__c> createGTMAndDetailsCropAllocation(){
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        String fiscalyear = getFiscalYear();
        Sales_Org__c salesOrg = getSalesOrg();
        Id userId = userInfo.getUserId();
        List<GTM__c> gtms = new  List<GTM__c>();
        if(Schema.sObjectType.GTM__c.isAccessible()){
            gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
        }
        User userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
        GTM__c gtm = new GTM__c();
        if(gtms.size()==0){
            gtm.Fiscal_Year__c = fiscalyear;
            gtm.GTM_Status__c = 'Draft';
            gtm.Sales_Org__c = salesOrg.Id;
            gtm.Sales_Rep__c = userInfo.getUserId();
            gtm.Sales_Rep_Name__c = userInfo.getName();
            gtm.Role__c = userDetails.UserRole.Name; //TODO: Need to set user role using Query
            if(Schema.sObjectType.GTM__c.isCreateable()){
                System.debug('Create GTM');
                insert gtm;
                gtms.add(gtm);
            }else{
                System.debug('Please provide GTM__c Create Access to the profile');
            }
        }

        //Creating GTM_Details__c
        Id recordTypeCropAllocation = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        System.debug('recordTypeCropAllocation '+recordTypeCropAllocation);
        for(Account acc:getGTMCustomers()){
            for(Crop__c crop:getActiveCrop()){
                System.debug('For loop Crop__c '+crop);
                GTM_Details__c gtmDetail = new GTM_Details__c();
                gtmDetail.recordTypeId = recordTypeCropAllocation;
                gtmDetail.Crop__c = crop.Id;
                gtmDetail.Crop_Allocation__c = 0;
                gtmDetail.GTM_Customer__c = acc.Id;
                gtmDetail.Sales_Org__c = salesOrg.Id;
                gtmDetail.GTM__c = gtms[0].Id;
                gtmDetails.add(gtmDetail);
            }
        }
        if(Schema.sObjectType.GTM_Details__c.isCreateable()){
            System.debug('insert Details '+gtmDetails.size());
            try {
                insert gtmDetails;
            } catch (Exception e) {
                System.debug('exception '+e);
            }
        }else{
            System.debug('Please provide GTM_Details__c Create Access to the profile');
        } 
    return getGTMDetailsCrop(fiscalyear);
   }

   private static List<Crop__c> getActiveCrop(){
       String salesOrgCode = getSalesOrg().Sales_Org_Code__c;
    List<Crop__c> listCrop = new List<Crop__c>();
        if(Schema.sObjectType.Crop__c.isAccessible()){
            listCrop = [select Id,Name from Crop__c where GTM_Status__c='Active' and Sales_Org_Code__c=:salesOrgCode];
        }
        return listCrop;
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

    private static List<GTM_Details__c> getGTMDetailsProduct(String fiscalyear){
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Product Category Allocation').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Product_Category__c,Product_Category__r.Name,Product_Category_Allocation__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:getSalesOrg().Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypeProductCategory];

        System.debug('gtmDetails '+gtmDetails.size());
        if(gtmDetails.size()>0){
            return gtmDetails;
        }
        return gtmDetails;
    }

    private static List<GTM_Details__c> getGTMDetailsCrop(String fiscalyear){
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Crop__c,Crop__r.Name,Crop_Allocation__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:getSalesOrg().Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypeProductCategory];

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

    @AuraEnabled
    public static string updateGTMDetailProductAllocation(String gtmId,String value){
        GTM_Details__c detail = [SELECT ID,Name,Product_Category_Allocation__c from GTM_Details__c where Id=:gtmId];
        detail.Product_Category_Allocation__c = Decimal.valueOf(value);
        if(Schema.sObjectType.GTM_Details__c.isUpdateable()){
            update detail;
        }else{System.debug('Please provide GTM_Details__c update access to profile');}
        return value;
    }
    
    @AuraEnabled
    public static string updateGTMDetailCropAllocation(String gtmId,String value){
        GTM_Details__c detail = [SELECT ID,Name,Crop_Allocation__c from GTM_Details__c where Id=:gtmId];
        detail.Crop_Allocation__c = Decimal.valueOf(value);
        if(Schema.sObjectType.GTM_Details__c.isUpdateable()){
            update detail;
        }else{System.debug('Please provide GTM_Details__c update access to profile');}
        return value;
    }
}
