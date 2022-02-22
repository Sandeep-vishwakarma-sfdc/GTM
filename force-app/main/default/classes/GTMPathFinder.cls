public without sharing class GTMPathFinder {
    private static String fiscalyear = setFiscalYear('');
    private static Sales_Org__c salesOrg = getSalesOrg();

    @AuraEnabled
    public static String setFiscalYear(String financialYear){
        if(String.isEmpty(financialYear)){
            fiscalyear = getFiscalYear();
        }else{
            fiscalyear = financialYear;
        }
        return fiscalyear;
    }

    @AuraEnabled
    public static List<GTM_Details__c> getPotentialAndProfile(String year){ // PotentialAndProfile Data used in GTMComponents
        List<GTM_Details__c> gtmPotentialProfile = new List<GTM_Details__c>();
        try {
            Id userId = userInfo.getUserId();
            List<GTM__c> gtms = new  List<GTM__c>();
            User userDetails = null;
            if(Schema.sObjectType.GTM__c.isAccessible() && Schema.sObjectType.User.isAccessible()){
             gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:year and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
             userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
            }
             GTM__c gtm = new GTM__c();
           if(gtms.size()==0){
                gtm.Fiscal_Year__c = year;
                gtm.GTM_Status__c = 'Draft';
                gtm.Sales_Org__c = salesOrg.Id;
                gtm.Sales_Rep__c = userInfo.getUserId();
                gtm.Sales_Rep_Name__c = userInfo.getName();
                gtm.Role__c = userDetails.UserRole.Name;
                gtm.Email__c = userDetails.Email;
                if(Schema.sObjectType.GTM__c.isCreateable()){
                    System.debug('Create GTM');
                    insert gtm;
                    gtms.add(gtm);
                }else{
                    System.debug('Please provide GTM__c Create Access to the profile');
                }
            }
            if(isGTMProfileAndPotentialCreated(year)==false){
                createGTMPotentialAndProfile(gtms[0]);
            }
            gtmPotentialProfile = getGTMPotentialProfile(year);
        } catch (Exception e) {
            System.debug('Exception in getPotentialAndProfile'+e);
        }
        return gtmPotentialProfile;
    }

    @AuraEnabled
    public static Map<string,List<GTM_Details__c>> getCatergoryAllocation(String year){ // Product Catergory Allocation Data used in GTMComponents
        List<GTM_Details__c> gtmDetails = getGTMDetailsProduct(year);
        if(gtmDetails.size()==0){
            gtmDetails = createGTMAndDetailsProductAllocation(year); 
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
    public static Map<string,List<GTM_Details__c>> getCropAllocation(String year){ // Crop Allocation Data used in GTMComponents
        System.debug('getCropAllocation Year '+year);
        List<GTM_Details__c> gtmDetails = getGTMDetailsCrop(year);
        if(gtmDetails.size()==0){
            gtmDetails = createGTMAndDetailsCropAllocation(getActiveCrop(),year); 
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
            gtmd.Sales_Org__c = salesorg.Id;
            gtmDetails.add(gtmd);
        }
        System.debug('PotentialProfile '+gtmDetails.size());
        if(Schema.sObjectType.GTM_Details__c.isCreateable()){
            insert gtmDetails;
        }
    }
    @AuraEnabled
    public static List<Account> getGTMCustomers(){ // GTMCustomer = Lead + Non-Lead Customer
        List<Account> gtmCustomers = new List<Account>();
        List<Account> leadCustomerList = new List<Account>();
        List<Account> nonLeadCustomerList = new List<Account>();
        Id leadcustomerRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Lead Customer').getRecordTypeId();
        Id nonleadcustomerRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Distributor').getRecordTypeId();
        System.debug('leadcustomerRecordType '+leadcustomerRecordType);
        //System.debug('filter Sales_Org_Code__c'+salesOrg.Sales_Org_Code__c+' leadrecordType '+leadcustomerRecordType+' Lead_Customer_Ownership__c '+userInfo.getUserId());
        if(Schema.sObjectType.Account.isAccessible()){
            // Getting Lead Customers by record type
            leadCustomerList = [select Id,Name,Lead_Customer_Type__c from Account where Sales_Org_Code__c=:salesOrg.Sales_Org_Code__c and Account_Type__c='Sold To Party' and recordType.Id=:leadcustomerRecordType and Lead_Customer_Ownership__c=:userInfo.getUserId()];
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

    public static List<Product_Category__c> getActiveProductCategory(){
        List<Product_Category_Sales_Org_Mapping__c> productCategoryMapping = new List<Product_Category_Sales_Org_Mapping__c>();
        List<Product_Category__c> productCategories = new List<Product_Category__c>();
        if(Schema.sObjectType.Product_Category_Sales_Org_Mapping__c.isAccessible() && Schema.sObjectType.Product_Category__c.isAccessible()){
            productCategoryMapping = [select id,Name,Product_Category__c,Product_Category__r.Name,Product_Category__r.Help_Text__c from Product_Category_Sales_Org_Mapping__c where Status__c='Active' and Sales_Org__r.Sales_Org_Code__c=:salesOrg.Sales_Org_Code__c];
            List<String> productCategoriesId = new List<String>(); 
            for(Product_Category_Sales_Org_Mapping__c pcm:productCategoryMapping){
                Product_Category__c productCategory = new Product_Category__c();
                productCategory.Id = pcm.Product_Category__r.Id;
                productCategory.Name = pcm.Product_Category__r.Name;
                productCategory.Help_Text__c = pcm.Product_Category__r.Help_Text__c;
                productCategories.add(productCategory);
            }
        }
        return productCategories;
    }

    private static List<GTM_Details__c> createGTMAndDetailsProductAllocation(String year){
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        Id userId = userInfo.getUserId();
        List<GTM__c> gtms = new  List<GTM__c>();
        gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:year and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
        User userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
        GTM__c gtm = new GTM__c();
        if(gtms.size()==0){
            gtm.Fiscal_Year__c = year;
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
        if(isGTMProfileAndPotentialCreated(year)==false){
            createGTMPotentialAndProfile(gtms[0]);
        }
        gtmPotentialProfile = getGTMPotentialProfile(year);
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
    return getGTMDetailsProduct(year);
    }

  

    public static List<GTM_Details__c> getGTMPotentialProfile(String fiscalyear){
        Id recordTypePotentialProfile = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Profile & Potential').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.recordTypeId,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,GTM_Customer_Type__c ,Total_Purchase_of_Crop_Protection_PY__c,Estimated_Markup_of_Channel__c,Estimated_Number_of_Sales_Rep_on_Role__c,Number_of_Stores_That_the_Channel_Has__c,GTM_Customer__r.Lead_Customer_Type__c,isSubmitted__c from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypePotentialProfile ORDER BY GTM_Customer__r.Name ASC];
        return gtmDetails;
    }

    

    public static boolean isGTMProfileAndPotentialCreated(String fiscalyear){
        Id recordTypePotentialProfile = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Profile & Potential').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,GTM_Customer__r.Lead_Customer_Type__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypePotentialProfile];
        System.debug('gtmDetails Profile And Potential'+gtmDetails.size());
        if(gtmDetails.size()>0){
            return true;
        }
        return false;
    }

    @AuraEnabled
    public static List<GTM_Details__c> createGTMAndDetailsCropAllocation(List<Crop__c> activeCrops,String year){
        System.debug('createGTMAndDetailsCropAllocation Year '+year);
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        Id userId = userInfo.getUserId();
        List<GTM__c> gtms = new  List<GTM__c>();
        gtms = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:year and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
        User userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
        GTM__c gtm = new GTM__c();
        if(gtms.size()==0){
            gtm.Fiscal_Year__c = year;
            gtm.GTM_Status__c = 'Draft';
            gtm.Sales_Org__c = salesOrg.Id;
            gtm.Sales_Rep__c = userInfo.getUserId();
            gtm.Sales_Rep_Name__c = userInfo.getName();
            gtm.Role__c = userDetails.UserRole.Name; //TODO: Need to set user role using Query
            if(Schema.sObjectType.GTM__c.isCreateable() && !String.isEmpty(year)){
                System.debug('Create GTM');//TODO
                insert gtm;
                gtms.add(gtm);
            }else{
                System.debug('Please provide GTM__c Create Access to the profile');
            }
        }
        List<GTM_Details__c> gtmPotentialProfile = new List<GTM_Details__c>();
        if(isGTMProfileAndPotentialCreated(year)==false){
            createGTMPotentialAndProfile(gtms[0]);
        }
        gtmPotentialProfile = getGTMPotentialProfile(year);
        Map<String,GTM_Details__c> mapPotentialProfile = new  Map<String,GTM_Details__c>();
        for(GTM_Details__c gtm1:gtmPotentialProfile){
            mapPotentialProfile.put(gtm1.GTM_Customer__c,gtm1);
        }
        //Creating GTM_Details__c
        Id recordTypeCropAllocation = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        System.debug('recordTypeCropAllocation '+recordTypeCropAllocation);
        for(Account acc:getGTMCustomers()){
            for(Crop__c crop:activeCrops){
                System.debug('For loop Crop__c '+crop);
                GTM_Details__c gtmDetail = new GTM_Details__c();
                gtmDetail.recordTypeId = recordTypeCropAllocation;
                gtmDetail.Crop__c = crop.Id;
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
    return getGTMDetailsCrop(year);
   }

    public static List<Crop__c> getActiveCrop(){
    List<Crop__c> listCrop = new List<Crop__c>();
        if(Schema.sObjectType.Crop__c.isAccessible()){
            listCrop = [select Id,Name,Help_Text__c from Crop__c where GTM_Status__c='Active' and Sales_Org_Code__c=:salesOrg.Sales_Org_Code__c];
        }
        return listCrop;
    }

    @AuraEnabled
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
            if(country=='Italy'){
                country = 'Italy - Domestic';
            }
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
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,Product_Category__c,Product_Category__r.Name,Product_Category__r.Help_Text__c,Product_Category_Allocation__c,GTM_Details__r.Total_Purchase_of_Crop_Protection_PY__c,GTM_Customer__r.Lead_Customer_Type__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypeProductCategory order by Product_Category__r.Name ASC]; 

        System.debug('gtmDetails '+gtmDetails.size());
        if(gtmDetails.size()>0){
            return gtmDetails;
        }
        return gtmDetails;
    }

    private static List<GTM_Details__c> getGTMDetailsCrop(String fiscalyear){
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        gtmDetails = [Select Id,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,Crop__c,Crop__r.Name,Crop__r.Help_Text__c,Crop_Allocation__c,GTM_Details__r.Total_Purchase_of_Crop_Protection_PY__c,GTM_Customer__r.Lead_Customer_Type__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:recordTypeProductCategory order by Crop__r.Name ASC];

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
        try {
            GTM_Details__c detail = [SELECT ID,Name,Product_Category_Allocation__c from GTM_Details__c where Id=:gtmId];
            detail.Product_Category_Allocation__c = value!=null?Decimal.valueOf(value):null;
            if(Schema.sObjectType.GTM_Details__c.isUpdateable()){
                update detail;
            }
        } catch (Exception e) {
            System.debug('Exception in updateGTMDetailProductAllocation '+e);
        }
        return value;
    }
    
    @AuraEnabled
    public static string updateGTMDetailCropAllocation(String gtmId,String value){
        GTM_Details__c detail = [SELECT ID,Name,Crop_Allocation__c from GTM_Details__c where Id=:gtmId];
        detail.Crop_Allocation__c = value!=null?Decimal.valueOf(value):null;
        if(Schema.sObjectType.GTM_Details__c.isUpdateable()){
            update detail;
        }else{System.debug('Please provide GTM_Details__c update access to profile');}
        return value;
    }

    @AuraEnabled
    public static string updateGTMDetailPotentialProfile(String gtmId,String name,String value){
        try {
           GTM_Details__c detail = [SELECT ID,Name,Crop_Allocation__c from GTM_Details__c where Id=:gtmId];
        if(name=='Total_Purchase_of_Crop_Protection_PY__c'){
            detail.Total_Purchase_of_Crop_Protection_PY__c = value!=null?Decimal.valueOf(value):null;
        }
        if(name=='Estimated_Markup_of_Channel__c'){
            detail.Estimated_Markup_of_Channel__c = value!=null?Decimal.valueOf(value):null;
        }
        if(name=='Estimated_Number_of_Sales_Rep_on_Role__c'){
            detail.Estimated_Number_of_Sales_Rep_on_Role__c = value!=null?Decimal.valueOf(value):null;
        }
        if(name=='Number_of_Stores_That_the_Channel_Has__c'){
            detail.Number_of_Stores_That_the_Channel_Has__c = value!=null?Decimal.valueOf(value):null;
        }
        if(name=='GTM_Customer_Type__c'){
            detail.GTM_Customer_Type__c = value;
        }
        update detail;
       } catch (Exception e) {
           System.debug('custom exception value null '+e);
       }
       return value;
    }

    @AuraEnabled(cacheable=true)
    public static GTM_Country_Configuration__c getInstructions(){
        List<GTM_Country_Configuration__c> gcc = null; 
        if(Schema.sObjectType.GTM_Country_Configuration__c.isAccessible()){
            gcc = [select Id,Name ,Instruction_Profile_Potential__c,Instruction_Product_Category_Allocatio__c,Instruction_Crop_Allocation__c from GTM_Country_Configuration__c where Sales_Org__c=:salesOrg.Id];
        }
        if(gcc.size()>0){
            return gcc[0];
        }
        return null;
    }

    @AuraEnabled
    public static boolean isWindowPeriodClosed(){
        List<String>  months = new List<String>{'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'};
        GTM_Country_Configuration__c gcc = [select Id,Start_Day__c,Start_Month__c,End_Day__c,End_Month__c  from GTM_Country_Configuration__c where Sales_Org__c=:salesOrg.Id  limit 1];
        Date currentDate = Date.today();
        Integer startMonth = months.indexOf(gcc.Start_Month__c)+1;
        Integer endMonth = months.indexOf(gcc.End_Month__c)+1;
        Integer startDay = Integer.valueOf(gcc.Start_Day__c);
        Integer endDay = Integer.valueOf(gcc.End_Day__c);
        Integer currentMonth = currentDate.month();
        Integer currentDay = currentDate.day();
        if(currentDay>=startDay && currentDay<=endDay && currentMonth>=startMonth && currentMonth<=endMonth){//Users are allowed to edit records
            return false;
        }else{// Disable editing records
            return true;
        }
    }

    @AuraEnabled
    public static List<Account> getNewGTMCustomers(){ 
        Map<String,Account> newGTMCustomers = new Map<String,Account>();
        Set<String> oldAccounts = new Set<String>();
        List<Account> newAccountsFound = new List<Account>();
        for(Account customer : getGTMCustomers()){
            newGTMCustomers.put(customer.Id,customer);
        }
        Map<String,List<String>> maprecordTypeDetails = new Map<String,List<String>>();
        List<GTM_Details__c> gtmdetailsAccounts = [Select Id,recordTypeId,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,GTM_Customer__r.Lead_Customer_Type__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId()];

        for(GTM_Details__c detailsAccount:gtmdetailsAccounts){
            List<String> listAccount = new List<String>();
            if(maprecordTypeDetails.containskey(detailsAccount.recordTypeId)){
                listAccount = maprecordTypeDetails.get(detailsAccount.recordTypeId);
                listAccount.add(detailsAccount.GTM_Customer__c);
                maprecordTypeDetails.put(detailsAccount.recordTypeId,listAccount);
            }else{
                listAccount.add(detailsAccount.GTM_Customer__c);
                maprecordTypeDetails.put(detailsAccount.recordTypeId,listAccount);
            }
        }

        Id recordTypePotentialProfile = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Profile & Potential').getRecordTypeId();
        Id recordTypeCropAllocation = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Product Category Allocation').getRecordTypeId();
        Id recordTypeCompetition = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Competitor').getRecordTypeId();
        Id recordTypeOutlook = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Outlook').getRecordTypeId();

        System.debug('maprecordTypeDetails '+maprecordTypeDetails);
        for(Account newCustomer : newGTMCustomers.values()){
            System.debug('newCustomer '+newCustomer);
            boolean potentialProfileData = maprecordTypeDetails.get(recordTypePotentialProfile)?.contains(newCustomer.id);
            boolean productCatergoryData = maprecordTypeDetails.get(recordTypeCropAllocation)?.contains(newCustomer.id);
            boolean cropAllocationData = maprecordTypeDetails.get(recordTypeProductCategory)?.contains(newCustomer.id);
            boolean competitionData = maprecordTypeDetails.get(recordTypeCompetition)?.contains(newCustomer.id);
            boolean outlookdata = maprecordTypeDetails.get(recordTypeOutlook)?.contains(newCustomer.id);
            System.debug('potentialProfileData '+potentialProfileData+' productCatergoryData '+productCatergoryData+' cropAllocationData '+cropAllocationData+' competitionData '+competitionData+' outlookdata '+outlookdata);
            if(potentialProfileData==false && productCatergoryData==false && cropAllocationData==false && competitionData==false && outlookdata==false){ // new customer not having any type of GTM Details
                newAccountsFound.add(newCustomer);
            }
        }
        System.debug('new Accounts added'+newAccountsFound);
        return newAccountsFound;
    }

    @AuraEnabled
    public static string createNewCustomerDetails(String newAccounts){
        Id userId = userInfo.getUserId();
        GTM__c gtm = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId limit 1];
        

        Map<String,GTM_Details__c> mapPotentialProfile = new  Map<String,GTM_Details__c>();
        List<Account> newCustomers = (List<Account>)JSON.deserialize(newAccounts,List<Account>.class);

        Id recordTypePotentialProfile = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Profile & Potential').getRecordTypeId();
        Id recordTypeCropAllocation = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        Id recordTypeProductCategory = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Product Category Allocation').getRecordTypeId();
        Id recordTypeCompetition = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Competitor').getRecordTypeId();
        Id recordTypeOutlook = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Outlook').getRecordTypeId();

        List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
        //Create Potential Profile for newly added customers
        for(Account acc:newCustomers){
            GTM_Details__c gtmd = new GTM_Details__c();
            gtmd.GTM_Customer__c = acc.Id;
            gtmd.recordTypeId = recordTypePotentialProfile;
            gtmd.GTM_Customer_Type__c = acc.Lead_Customer_Type__c;
            gtmd.GTM__c = gtm.Id;
            gtmd.Sales_Org__c = salesorg.Id;
            gtmDetails.add(gtmd);
        }
        insert gtmDetails;
        
        for(GTM_Details__c gtm1:gtmDetails){
            mapPotentialProfile.put(gtm1.GTM_Customer__c,gtm1);
        }
        // Create Crop Allocation for newly added Customers
        gtmDetails.clear();
        for(Account acc:newCustomers){
            for(Crop__c crop:getActiveCrop()){
                System.debug('For loop Crop__c '+crop);
                GTM_Details__c gtmDetail = new GTM_Details__c();
                gtmDetail.recordTypeId = recordTypeCropAllocation;
                gtmDetail.Crop__c = crop.Id;
                gtmDetail.GTM_Customer__c = acc.Id;
                gtmDetail.Sales_Org__c = salesOrg.Id;
                gtmDetail.GTM__c = gtm.Id;
                gtmDetail.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
                gtmDetails.add(gtmDetail);
            }
        }
        insert gtmDetails;

        // Create Product Allocation for newly added Customers
        gtmDetails.clear();
        for(Account acc:newCustomers){
            for(Product_Category__c pc:getActiveProductCategory()){
                System.debug('For loop Product_Category__c '+pc);
                GTM_Details__c gtmDetail = new GTM_Details__c();
                gtmDetail.recordTypeId = recordTypeProductCategory;
                gtmDetail.Product_Category__c = pc.Id;
                gtmDetail.GTM_Customer__c = acc.Id;
                gtmDetail.Sales_Org__c = salesOrg.Id;
                gtmDetail.GTM__c = gtm.Id;
                gtmDetail.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
                gtmDetails.add(gtmDetail);
            }
        }
        insert gtmDetails;

        // Create Competition for newly added Customers
        gtmDetails.clear();
        for(Account acc:newCustomers){
            GTM_Details__c gtmd = new GTM_Details__c();
            gtmd.recordTypeId = recordTypeCompetition;
            gtmd.GTM_Customer__c = acc.Id;
            gtmd.GTM__c=gtm.Id;
            gtmd.Sales_Org__c=salesOrg.Id;
            gtmd.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
            gtmDetails.add(gtmd);
        }
        insert gtmDetails;

        //Create outlook 
        gtmDetails.clear();
        for(Account acc :newCustomers){
            GTM_Details__c gtmDetailsTemp = new GTM_Details__c();
            gtmDetailsTemp.recordTypeId = recordTypeOutlook;
            gtmDetailsTemp.GTM_Customer__c = acc.Id;
            gtmDetailsTemp.Sales_Org__c = salesorg.Id;
            gtmDetailsTemp.GTM__c = gtm.Id;
            gtmDetailsTemp.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
            gtmDetails.add(gtmDetailsTemp);
         }
         insert gtmDetails;
         return '';
    }

    @AuraEnabled
    public static List<Crop__c> getNewlyAddedCrop(){
        Id userId = userInfo.getUserId();
        GTM__c gtm = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId limit 1];
        Id recordTypeCropAllocation = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Crop Allocation').getRecordTypeId();
        List<Crop__c> allCrops = getActiveCrop(); // All Active Crops
        List<String> oldCrops = new List<String>();
        List<Crop__c> newCrops = new List<Crop__c>();
        Map<String,Crop__c> mapCrop = new Map<String,Crop__c>();
        List<AggregateResult> gtmCropDetails = [Select COUNT(Id),Crop__c from GTM_Details__c where GTM__c=:gtm.Id and recordTypeId=:recordTypeCropAllocation GROUP BY Crop__c]; // GTM details having crops
        
        for(AggregateResult  arrg: gtmCropDetails){
            oldCrops.add((String)arrg.get('Crop__c'));
        }

        for(Crop__c crop:allCrops){
            if(!oldCrops.contains(crop.Id)){
                newCrops.add(crop);
            }
        }
        return newCrops;
    }

    @AuraEnabled
    public static boolean updateClassificationDependent(String detailId){
        GTM_Details__c gtmD = [select Id,Name,Estimated_Markup_of_Channel__c,Estimated_Number_of_Sales_Rep_on_Role__c,Number_of_Stores_That_the_Channel_Has__c from GTM_Details__c where id=:detailId limit 1];
        gtmD.Estimated_Markup_of_Channel__c = null;
        gtmD.Estimated_Number_of_Sales_Rep_on_Role__c = null;
        gtmD.Number_of_Stores_That_the_Channel_Has__c = null;
        update gtmD;
        return true;
    }

    @AuraEnabled
    public static boolean submitGTMDetails(){
        try {
            GTM__c gtm = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userInfo.getUserId() limit 1];

            List<GTM_Details__c> gtmdetails = [Select id,Name,isSubmitted__c,GTM__c from GTM_Details__c where isSubmitted__c=false and GTM__c=:gtm.Id];

            for(GTM_Details__c gtmd:gtmdetails){
                gtmd.isSubmitted__c = true;
            }
            update gtmdetails;
            return true;
        } catch (Exception e) {
            System.debug('Exception while submitting records '+e);
            return false;
        }
    }

    @AuraEnabled
    public static GTM__c getGTM(String id){
        GTM__c gtm = [SELECT ID,Name,Fiscal_Year__c from GTM__c where Id=:id];
        return gtm;
    }

    @AuraEnabled(cacheable=true)
    public static User getUser(){
        User usr = [select Id,Name,Country from User where id=:userInfo.getUserId()];
        return usr;
    }

    @AuraEnabled(cacheable=true)
    public static string getLeadRecordTypeId(){
        Id leadcustomerRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Lead Customer').getRecordTypeId();
        return String.valueOf(leadcustomerRecordType); 
    }

    @AuraEnabled
    public static List<GTM_Details__c> getGTMDetailsToDisable(String recordTypeName){
        Id detailRecordType = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get(recordTypeName).getRecordTypeId();
        List<GTM_Details__c> gtmDetailsToDisable = new List<GTM_Details__c>();
        List<String> allCustomersId = new List<String>();
        List<GTM_Details__c> allGtmDetails = [Select Id,recordTypeId,Name,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Path_Finder__c,GTM_Customer__r.Lead_Customer__c,GTM_Customer__r.Lead_Customer_Type__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where GTM__r.Fiscal_Year__c=:fiscalyear and GTM__r.Sales_Org__c=:salesOrg.Id and GTM__r.Sales_Rep__c=:userInfo.getUserId() and recordTypeId=:detailRecordType];
        List<Account> allCustomers = getGTMCustomers();
        for(Account a:allCustomers){
            allCustomersId.add(a.Id);
        }
        for(GTM_Details__c g:allGtmDetails){
            if(!allCustomersId.contains(g.GTM_Customer__c)){
                gtmDetailsToDisable.add(g);
            }
        }
        return gtmDetailsToDisable;
    }
}