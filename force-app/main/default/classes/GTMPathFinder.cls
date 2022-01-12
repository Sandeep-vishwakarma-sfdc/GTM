public with sharing class GTMPathFinder {
    private static String fiscalyear = getFiscalYear();
    private static Sales_Org__c salesOrg = getSalesOrg();
    @AuraEnabled
    public static List<GTM_Details__c> getPotentialAndProfile(){
        List<GTM_Details__c> gtmPotentialProfile = new List<GTM_Details__c>();
        try {
            Id userId = userInfo.getUserId();
            List<GTM__c> gtms = new  List<GTM__c>();
            User userDetails = null;
            if(Schema.sObjectType.GTM__c.isAccessible() && Schema.sObjectType.User.isAccessible()){
             gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
             userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
            }
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
            if(isGTMProfileAndPotentialCreated(fiscalyear)==false){
                createGTMPotentialAndProfile(gtms[0]);
            }
            gtmPotentialProfile = getGTMPotentialProfile(fiscalyear);
        } catch (Exception e) {
            System.debug('Exception in getPotentialAndProfile'+e);
        }
        return gtmPotentialProfile;
    }

    @AuraEnabled
    public static Map<string,List<GTM_Details__c>> getCatergoryAllocation(){
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

    public static void createGTMPotentialAndProfile(GTM__c gtm){
        Id recordTypePotentialProfile = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Profile & Potential').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        for(Account acc:getGTMCustomers()){
            GTM_Details__c gtmd = new GTM_Details__c();
            gtmd.GTM_Customer__c = acc.Id;
            gtmd.recordTypeId = recordTypePotentialProfile;
            gtmd.GTM_Customer_Type__c = acc.Lead_Customer_Type__c;
            gtmd.GTM__c = gtm.Id;
            gtmd.Total_Purchase_of_Crop_Protection_PY__c = 0;
            gtmd.Estimated_Markup_of_Channel__c = 0;
            gtmd.Estimated_Number_of_Sales_Rep_on_Role__c = 0;
            gtmd.Number_of_Stores_That_the_Channel_Has__c = 0;
            gtmd.Sales_Org__c = salesorg.Id;
            gtmDetails.add(gtmd);
        }
        System.debug('PotentialProfile '+gtmDetails.size());
        if(Schema.sObjectType.GTM_Details__c.isCreateable()){
            insert gtmDetails;
        }
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
            leadCustomerList = [select Id,Name,Lead_Customer_Type__c from Account where Sales_Org_Code__c=:salesOrg.Sales_Org_Code__c  and recordType.Id=:leadcustomerRecordType and Lead_Customer_Ownership__c=:userInfo.getUserId()];
            System.debug('Lead Customer '+leadCustomerList);
            // Getting non-lead customer when lead customer field is empty
            nonLeadCustomerList = [select Id,Name,Lead_Customer_Type__c from Account where Sales_Org_Code__c=:salesOrg.Sales_Org_Code__c and Account_Type__c='Sold To Party' and Lead_Customer__c=null and Lead_Customer_Ownership__c=:userInfo.getUserId() and recordTypeId=:nonleadcustomerRecordType];
            System.debug('non lead '+nonLeadCustomerList);
            gtmCustomers.addAll(leadCustomerList);
            gtmCustomers.addAll(nonLeadCustomerList);
            System.debug('GTM Customer size'+gtmCustomers.size());
            return gtmCustomers;
        }
        System.debug(gtmCustomers);
        return gtmCustomers;
    }

    private static List<Product_Category__c> getActiveProductCategory(){
        List<Product_Category_Sales_Org_Mapping__c> productCategoryMapping = new List<Product_Category_Sales_Org_Mapping__c>();
        List<Product_Category__c> productCategories = new List<Product_Category__c>();
        if(Schema.sObjectType.Product_Category_Sales_Org_Mapping__c.isAccessible() && Schema.sObjectType.Product_Category__c.isAccessible()){
            productCategoryMapping = [select id,Name,Product_Category__c,Product_Category__r.Name from Product_Category_Sales_Org_Mapping__c where Status__c='Active' and Sales_Org__r.Sales_Org_Code__c=:salesOrg.Sales_Org_Code__c];
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
        Id userId = userInfo.getUserId();
        List<GTM__c> gtms = new  List<GTM__c>();
        gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
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
        List<GTM_Details__c> gtmPotentialProfile = new List<GTM_Details__c>();
        if(isGTMProfileAndPotentialCreated(fiscalyear)==false){
            createGTMPotentialAndProfile(gtms[0]);
        }
        gtmPotentialProfile = getGTMPotentialProfile(fiscalyear);
        Map<String,GTM_Details__c> mapPotentialProfile = new  Map<String,GTM_Details__c>();
        for(GTM_Details__c gtm1:gtmPotentialProfile){
            mapPotentialProfile.put(gtm1.GTM_Customer__c,gtm1);
        }
        for(Account acc:getGTMCustomers()){
            for(Product_Category__c pc:getActiveProductCategory()){
                System.debug('For loop Product_Category__c '+pc);
                GTM_Details__c gtmDetail = new GTM_Details__c();
                gtmDetail.recordTypeId = recordTypeProductCategory;
                gtmDetail.Product_Category__c = pc.Id;
                gtmDetail.GTM_Customer__c = acc.Id;
                gtmDetail.Product_Category_Allocation__c = 0;
                gtmDetail.Sales_Org__c = salesOrg.Id;
                gtmDetail.GTM__c = gtms[0].Id;
                gtmDetail.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
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

  

    public static List<GTM_Details__c> getGTMPotentialProfile(String fiscalyear){
        Id recordTypePotentialProfile = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Profile & Potential').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,GTM_Customer_Type__c ,Total_Purchase_of_Crop_Protection_PY__c,Estimated_Markup_of_Channel__c,Estimated_Number_of_Sales_Rep_on_Role__c,Number_of_Stores_That_the_Channel_Has__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypePotentialProfile ORDER BY GTM_Customer__r.Name ASC];
        return gtmDetails;
    }

    

    public static boolean isGTMProfileAndPotentialCreated(String fiscalyear){
        Id recordTypePotentialProfile = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Profile & Potential').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypePotentialProfile];
        System.debug('gtmDetails Profile And Potential'+gtmDetails.size());
        if(gtmDetails.size()>0){
            return true;
        }
        return false;
    }

    private static List<GTM_Details__c> createGTMAndDetailsCropAllocation(){
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        Id userId = userInfo.getUserId();
        List<GTM__c> gtms = new  List<GTM__c>();
        gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
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
        List<GTM_Details__c> gtmPotentialProfile = new List<GTM_Details__c>();
        if(isGTMProfileAndPotentialCreated(fiscalyear)==false){
            createGTMPotentialAndProfile(gtms[0]);
        }
        gtmPotentialProfile = getGTMPotentialProfile(fiscalyear);
        Map<String,GTM_Details__c> mapPotentialProfile = new  Map<String,GTM_Details__c>();
        for(GTM_Details__c gtm1:gtmPotentialProfile){
            mapPotentialProfile.put(gtm1.GTM_Customer__c,gtm1);
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
                gtmDetail.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
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
    List<Crop__c> listCrop = new List<Crop__c>();
        if(Schema.sObjectType.Crop__c.isAccessible()){
            listCrop = [select Id,Name from Crop__c where GTM_Status__c='Active' and Sales_Org_Code__c=:salesOrg.Sales_Org_Code__c];
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
        Sales_Org__c salesorg = getSalesOrg();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,Product_Category__c,Product_Category__r.Name,Product_Category_Allocation__c,GTM_Details__r.Total_Purchase_of_Crop_Protection_PY__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesorg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypeProductCategory]; // TODO: Need to Add potential profile field

        System.debug('gtmDetails '+gtmDetails.size());
        if(gtmDetails.size()>0){
            return gtmDetails;
        }
        return gtmDetails;
    }

    private static List<GTM_Details__c> getGTMDetailsCrop(String fiscalyear){
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        Sales_Org__c salesorg  = getSalesOrg();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,Crop__c,Crop__r.Name,Crop_Allocation__c,GTM_Details__r.Total_Purchase_of_Crop_Protection_PY__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesorg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypeProductCategory];

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

    @AuraEnabled
    public static string updateGTMDetailPotentialProfile(String gtmId,String name,String value){
        GTM_Details__c detail = [SELECT ID,Name,Crop_Allocation__c from GTM_Details__c where Id=:gtmId];
        if(name=='Total_Purchase_of_Crop_Protection_PY__c'){
            detail.Total_Purchase_of_Crop_Protection_PY__c = Decimal.valueOf(value);
        }
        if(name=='Estimated_Markup_of_Channel__c'){
            detail.Estimated_Markup_of_Channel__c = Decimal.valueOf(value);
        }
        if(name=='Estimated_Number_of_Sales_Rep_on_Role__c'){
            detail.Estimated_Number_of_Sales_Rep_on_Role__c = Decimal.valueOf(value);
        }
        if(name=='Number_of_Stores_That_the_Channel_Has__c'){
            detail.Number_of_Stores_That_the_Channel_Has__c = Decimal.valueOf(value);
        }
        if(name=='GTM_Customer_Type__c'){
            detail.GTM_Customer_Type__c = value;
        }
        update detail;
        return value;
    }

    @AuraEnabled(cacheable=true)
    public static GTM_Country_Configuration__c getInstructions(){
        List<GTM_Country_Configuration__c> gcc = [select Id,Name ,Instruction_Profile_Potential__c,Instruction_Product_Category_Allocatio__c,Instruction_Crop_Allocation__c from GTM_Country_Configuration__c where Sales_Org__c=:salesOrg.Id];
        if(gcc.size()>0){
            return gcc[0];
        }
        return null;
    }
}
