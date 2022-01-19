public without sharing class GTMCompetition {
    private static sales_org__c salesorg= GTMPathFinder.getSalesOrg();
    private static String  fiscalyear= GTMPathFinder.getFiscalYear();
@AuraEnabled
public static List<GTM_Details__c> getGTMCompetition(){
    Id competitorRecordType = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Competitor').getRecordTypeId();
    List<GTM_Details__c> gtmDetails = [select GTM_Customer__c, GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Competitor_Name_1__c,Competitor_Name_1__r.Name,Indicate_share_wallet_of_competitor_1__c,Competitor_Name_2__c,Indicate_share_wallet_of_competitor_2__c,Competitor_Name_3__c,Indicate_share_wallet_of_competitor_3__c,Competitor_Name_4__c,Indicate_share_wallet_of_competitor_4__c,Competitor_Name_5__c,Indicate_share_wallet_of_competitor_5__c,Competitor_Name_6__c,Indicate_share_wallet_of_competitor_6__c,Competitor_Name_7__c,Indicate_share_wallet_of_competitor_7__c,Competitor_Name_8__c,Indicate_share_wallet_of_competitor_8__c,UPL_Position__c,UPLs_share_of_wallet__c,Competitor_Name_2__r.Name,Competitor_Name_3__r.Name,Competitor_Name_4__r.Name,Competitor_Name_5__r.Name,Competitor_Name_6__r.Name,Competitor_Name_7__r.Name,Competitor_Name_8__r.Name,GTM_Customer__r.Path_Finder__c from GTM_Details__c where recordTypeId=:competitorRecordType and Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c];
    if(gtmDetails.size()==0){
        return createGTMDetail();
    }
        return gtmDetails;
}
    
public static List<GTM_Details__c> createGTMDetail(){
    List<Account> gtmCustomers = GTMPathFinder.getGTMCustomers();
    System.debug('The Gtm Customer size' +gtmCustomers.size());
    List<GTM_Details__c> gtmDetailstToInsert = new List<GTM_Details__c>();
    Id competitorRecordType = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Competitor').getRecordTypeId();
    List<GTM__c> gtms = new  List<GTM__c>();
    Id userId = userInfo.getUserId();
        gtms = [SELECT ID,Name,Fiscal_Year__c,Email__c from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
        User userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
        GTM__c gtm = new GTM__c();
        if(gtms.size()==0){
            gtm.Fiscal_Year__c = fiscalyear;
            gtm.GTM_Status__c = 'Draft';
            gtm.Sales_Org__c = salesOrg.Id;
            gtm.Sales_Rep__c = userInfo.getUserId();
            gtm.Sales_Rep_Name__c = userInfo.getName();
            gtm.Role__c = userDetails.UserRole.Name;
            gtm.Email__c=userDetails.Email;
            if(Schema.sObjectType.GTM__c.isCreateable()){
                System.debug('Create GTM');
                insert gtm;
                gtms.add(gtm);
            }else{
                System.debug('Please provide GTM__c Create Access to the profile');
            }
        }
        List<GTM_Details__c> gtmPotentialProfile = new List<GTM_Details__c>();
        if(GTMPathFinder.isGTMProfileAndPotentialCreated(fiscalyear)==false){
            GTMPathFinder.createGTMPotentialAndProfile(gtms[0]);
        }
        gtmPotentialProfile = GTMPathFinder.getGTMPotentialProfile(fiscalyear);

        Map<String,GTM_Details__c> mapPotentialProfile = new  Map<String,GTM_Details__c>();
        for(GTM_Details__c gtm1:gtmPotentialProfile){
            mapPotentialProfile.put(gtm1.GTM_Customer__c,gtm1);
        }




    for(Account acc:gtmCustomers){
        if(gtms.size()>0){
            GTM_Details__c gtmd = new GTM_Details__c();
            gtmd.recordTypeId = competitorRecordType;
            gtmd.GTM_Customer__c = acc.Id;
            gtmd.GTM__c=gtms[0].Id;
            gtmd.Sales_Org__c=salesorg.Id;
            gtmd.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
            gtmDetailstToInsert.add(gtmd);

        }
    }
    if(gtms.size()>0){
    insert gtmDetailstToInsert;
    }
    List<GTM_Details__c> gtmDetails =[select GTM_Customer__c, GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Competitor_Name_1__c,Competitor_Name_1__r.Name,Indicate_share_wallet_of_competitor_1__c,Competitor_Name_2__c,Indicate_share_wallet_of_competitor_2__c,Competitor_Name_3__c,Indicate_share_wallet_of_competitor_3__c,Competitor_Name_4__c,Indicate_share_wallet_of_competitor_4__c,Competitor_Name_5__c,Indicate_share_wallet_of_competitor_5__c,Competitor_Name_6__c,Indicate_share_wallet_of_competitor_6__c,Competitor_Name_7__c,Indicate_share_wallet_of_competitor_7__c,Competitor_Name_8__c,Indicate_share_wallet_of_competitor_8__c,UPL_Position__c,UPLs_share_of_wallet__c,Competitor_Name_2__r.Name,Competitor_Name_3__r.Name,Competitor_Name_4__r.Name,Competitor_Name_5__r.Name,Competitor_Name_6__r.Name,Competitor_Name_7__r.Name,Competitor_Name_8__r.Name,GTM_Customer__r.Path_Finder__c  from GTM_Details__c where recordTypeId=:competitorRecordType and  Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c];
    System.debug('Gtm details size' +gtmDetails.size());
    return gtmDetails;
  
  }
  @AuraEnabled
  public static GTM_Details__c  updateGTMDetails(String recordId,String name,String value)
  {
    
    GTM_Details__c upgtm=[select Id,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Indicate_share_wallet_of_competitor_1__c,Competitor_Name_1__c,Competitor_Name_1__r.Name,Indicate_share_wallet_of_competitor_2__c,Indicate_share_wallet_of_competitor_3__c,Indicate_share_wallet_of_competitor_4__c,Indicate_share_wallet_of_competitor_5__c,Indicate_share_wallet_of_competitor_6__c,Indicate_share_wallet_of_competitor_7__c,Indicate_share_wallet_of_competitor_8__c,UPL_Position__c,UPLs_share_of_wallet__c,Competitor_Name_2__c,Competitor_Name_3__c,Competitor_Name_4__c,Competitor_Name_5__c,Competitor_Name_6__c,Competitor_Name_7__c,Competitor_Name_8__c,Competitor_Name_2__r.Name,Competitor_Name_3__r.Name,Competitor_Name_4__r.Name,Competitor_Name_5__r.Name,Competitor_Name_6__r.Name,Competitor_Name_7__r.Name,Competitor_Name_8__r.Name,GTM_Customer__r.Path_Finder__c from GTM_Details__c where Id=:recordId];
    if(name=='Indicate_share_wallet_of_competitor_1__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_1__c=decimal.valueOf(value);
    }
    else if(name=='Indicate_share_wallet_of_competitor_2__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_2__c=decimal.valueOf(value);
    }
    else if(name=='Indicate_share_wallet_of_competitor_3__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_3__c=decimal.valueOf(value);
    }
    else if(name=='Indicate_share_wallet_of_competitor_4__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_4__c=decimal.valueOf(value);
    }
    else if(name=='Indicate_share_wallet_of_competitor_5__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_5__c=decimal.valueOf(value);
    }
    else if(name=='Indicate_share_wallet_of_competitor_6__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_6__c=decimal.valueOf(value);
    }
    else if(name=='Indicate_share_wallet_of_competitor_7__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_7__c=decimal.valueOf(value);
    }
    else if(name=='Indicate_share_wallet_of_competitor_8__c')
    {
        upgtm.Indicate_share_wallet_of_competitor_8__c =decimal.valueOf(value);
    }
   
    else if(name=='UPL_Position__c')
    {
        upgtm.UPL_Position__c =decimal.valueOf(value);
    }
    else if(name=='UPLs_share_of_wallet__c')
    {
        upgtm.UPLs_share_of_wallet__c =decimal.valueOf(value);
    }
    else if(name=='Competitor_Name_1__c')
    {
        upgtm.Competitor_Name_1__c =value;
    }
    else if(name=='Competitor_Name_2__c')
    {
        upgtm.Competitor_Name_2__c =value;
    }
    else if(name=='Competitor_Name_3__c')
    {
        upgtm.Competitor_Name_3__c =value;
    }
    else if(name=='Competitor_Name_4__c')
    {
        upgtm.Competitor_Name_4__c =value;
    }
    else if(name=='Competitor_Name_5__c')
    {
        upgtm.Competitor_Name_5__c =value;
    }
    else if(name=='Competitor_Name_6__c')
    {
        upgtm.Competitor_Name_6__c =value;
    }
    else if(name=='Competitor_Name_7__c')
    {
        upgtm.Competitor_Name_7__c =value;
    }
    else if(name=='Competitor_Name_8__c')
    {
        upgtm.Competitor_Name_8__c =value;
    }
     
    update upgtm;
    return upgtm;
 }
 @AuraEnabled
 public static GTM_Details__c  updateshare(String recordId)
 {
    GTM_Details__c upshare=[select Id,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,UPL_Position__c,UPLs_share_of_wallet__c,GTM_Customer__r.Path_Finder__c from GTM_Details__c where Id=:recordId];
    upshare.UPL_Position__c=0;
    upshare.UPLs_share_of_wallet__c=0;
    
    update upshare;
    return upshare;

 }


  @AuraEnabled
 public static List<Competitor__c> getCompetitorDetails()
 {
     List<Competitor__c> comp= [Select Id, Name ,Status__c from Competitor__c where Status__c ='Active' order by Name ASC];
     return comp;
     
 }



 @AuraEnabled
 public static List<GTM__c> getGtm()
 {
    List<GTM__c> gtmp = new  List<GTM__c>();
    Id userId = userInfo.getUserId();
        gtmp = [Select Id,Name,Fiscal_Year__c,Email__c,Role__c,Sales_Rep_Name__c,Sales_org__r.name from GTM__c where Fiscal_Year__c=:fiscalyear and Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c and Sales_Rep__c=:userId];
       
       
             return gtmp;  
     
    }

    @AuraEnabled
  public static GTM__c  updateGTM(String recordId,String name,String value)
  {
   
    GTM__c upgtm1=[select Id,Name,Fiscal_Year__c,Email__c,Role__c,Sales_Rep_Name__c from GTM__c where  Id=:recordId   ];
    if(name=='Role__c')
    {
        upgtm1.Role__c=value;
    }
    else if(name=='Email__c')
    {
        upgtm1.Email__c=value;
    }
    else if(name=='Sales_Rep_Name__c')
    {
        upgtm1.Sales_Rep_Name__c=value;
    }
    update upgtm1;
    return upgtm1;
    
   }


   @AuraEnabled(cacheable=true)
   public static GTM_Country_Configuration__c getInstructions1(){
       List<GTM_Country_Configuration__c> gcc = [select Id,Name ,Instruction_Competitor__c from GTM_Country_Configuration__c where Sales_Org__c=:salesOrg.Id];
       if(gcc.size()>0){
           return gcc[0];
       }
       return null;
   }

   @AuraEnabled(cacheable=true)
   public static GTM_Country_Configuration__c getInstructions2(){
       List<GTM_Country_Configuration__c> gcc = [select Id,Name ,Instruction_Identification__c from GTM_Country_Configuration__c where Sales_Org__c=:salesOrg.Id];
       if(gcc.size()>0){
           return gcc[0];
       }
       return null;
   }
    

 }