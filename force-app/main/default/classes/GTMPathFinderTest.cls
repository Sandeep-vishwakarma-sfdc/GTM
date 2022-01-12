@isTest
public with sharing class GTMPathFinderTest {
    public static Sales_Org__c salesOrg = createSalesOrg();
    public static Id loggedInUserId = userInfo.getUserId();
    public static Login_Country__c loginCountry = createLoginCountry();
    public static List<Account> gtmCustomers = createGTMCustomers();
    public static List<Product_Category_Sales_Org_Mapping__c> pcsm =  createProductSalesOrgMapping();
    public static List<Crop__c> crops =  createCrops();

    @isTest
    public static void testGetPotentialAndProfile(){
        List<GTM_Details__c> gtmPotentialAndProfile = GTMPathFinder.getPotentialAndProfile();
        System.assert(gtmPotentialAndProfile.size()>0,'Gtm Potential Profile created');
        Map<string,List<GTM_Details__c>> gtmProductCategory = GTMPathFinder.getCatergoryAllocation();
        System.assert(gtmProductCategory.size()>0,'Gtm Product Category created');
        //Map<string,List<GTM_Details__c>> gtmCropAllocation = GTMPathFinder.getCropAllocation();
        //System.assert(gtmCropAllocation.size()>0,'Gtm Crop Allocation created');
    }

    /*
    ################### Creating Sales org 
    */
    public static Sales_Org__c createSalesOrg(){
        Sales_Org__c salesOrg1 = new Sales_Org__c();
        salesOrg1.Name = 'Argentina';
        salesOrg1.Sales_Org_Code__c = '5631';
        insert salesOrg1;
        return salesOrg1;
    }

    /*
    ################### Creating GTM Customer 
    */
    public static List<Account> createGTMCustomers(){
        Id leadcustomerRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Lead Customer').getRecordTypeId();
        Id nonleadcustomerRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Distributor').getRecordTypeId();

        Account account = new Account();
        account.Sales_Org__c = salesOrg.Id;

        List<Account> accounts = new List<Account>();
        for(Integer i=1;i<=50;i++){
            Account gtmAccount = account.clone();
            gtmAccount.Name = 'Test Account '+i;
            if(math.mod(i,2)==0){//Lead Customer
                gtmAccount.Lead_Customer__c = '001';
                gtmAccount.recordTypeId = leadcustomerRecordType;
                gtmAccount.Lead_Customer_Ownership__c = loggedInUserId;
            }else{// Non-Lead Customer
                gtmAccount.recordTypeId = nonleadcustomerRecordType;
                gtmAccount.Account_Type__c = 'Sold To Party';
                gtmAccount.Lead_Customer_Ownership__c = loggedInUserId ;
            }
            accounts.add(gtmAccount);
        }
        insert accounts;
        return accounts;
    }

    /*
    ################### Creating Login country custom Setting
    */
    public static Login_Country__c createLoginCountry(){
        Login_Country__c loginCountry = new Login_Country__c();
        loginCountry.Name = 'Argentina';
        loginCountry.Sales_Org_Code__c = '5631';
        insert loginCountry;
        return loginCountry;
    }

    
    /*
    ################### Creating Product Category
    */

    public static List<Product_Category_Sales_Org_Mapping__c> createProductSalesOrgMapping(){
        List<Product_Category_Sales_Org_Mapping__c> pscms = new List<Product_Category_Sales_Org_Mapping__c>();
        Product_Category__c productCategory1 = new Product_Category__c();
        productCategory1.Name = 'Product1';
        productCategory1.Status__c = 'Active';
        insert productCategory1;

        Product_Category_Sales_Org_Mapping__c pcsm1 = new Product_Category_Sales_Org_Mapping__c();
        pcsm1.Product_Category__c=productCategory1.Id;
        pcsm1.Status__c = 'Active';
        pcsm1.Sales_Org__c = salesOrg.Id;
        insert pcsm1;
        
        
        Product_Category__c productCategory2 = new Product_Category__c();
        productCategory2.Name = 'Product2';
        productCategory2.Status__c = 'Active';
        insert productCategory2;

        Product_Category_Sales_Org_Mapping__c pcsm2 = new Product_Category_Sales_Org_Mapping__c();
        pcsm2.Product_Category__c=productCategory2.Id;
        pcsm2.Status__c = 'Active';
        pcsm2.Sales_Org__c = salesOrg.Id;
        insert pcsm1;
        pscms.add(pcsm1);
        pscms.add(pcsm2);
        return pscms;
    }

    public static List<Crop__c> createCrops(){
        List<Crop__c> crops = new List<Crop__c>();
        Crop__c crop1 = new Crop__c();
        crop1.Name = 'crop1';
        crop1.Status__c = 'Active';
        insert crop1;
        Crop__c crop2 = new Crop__c();
        crop2.Name = 'crop2';
        crop2.Status__c = 'Active';
        insert crop2;
        crops.add(crop1);
        crops.add(crop2);
        return crops;
    }

}