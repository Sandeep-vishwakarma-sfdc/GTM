public without sharing class GTMCompetition {
    private static sales_org__c salesorg= GTMPathFinder.getSalesOrg();
    private static String  fiscalyear= GTMPathFinder.getFiscalYear();
    private static String profileName = GTMPathFinder.profileName;
    
@AuraEnabled
public static List<GTM_Details__c> getGTMCompetition(String year){
    Id userId = userInfo.getUserId();
    Id competitorRecordType = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Competitor').getRecordTypeId();
    List<GTM_Details__c> gtmDetails = new List<GTM_Details__c>();
    if(profileName!='Admin/KeyUser Mexico'){
        gtmDetails = [select id,GTM_Customer__c, GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Competitor_Name_1__c,Competitor_Name_1__r.Name,Indicate_share_wallet_of_competitor_1__c,Competitor_Name_2__c,Indicate_share_wallet_of_competitor_2__c,Competitor_Name_3__c,Indicate_share_wallet_of_competitor_3__c,Competitor_Name_4__c,Indicate_share_wallet_of_competitor_4__c,Competitor_Name_5__c,Indicate_share_wallet_of_competitor_5__c,Competitor_Name_6__c,Indicate_share_wallet_of_competitor_6__c,Competitor_Name_7__c,Indicate_share_wallet_of_competitor_7__c,Competitor_Name_8__c,Indicate_share_wallet_of_competitor_8__c,UPL_Position__c,UPLs_share_of_wallet__c,Competitor_Name_2__r.Name,Competitor_Name_3__r.Name,Competitor_Name_4__r.Name,Competitor_Name_5__r.Name,Competitor_Name_6__r.Name,Competitor_Name_7__r.Name,Competitor_Name_8__r.Name,GTM_Customer__r.Path_Finder__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where recordTypeId=:competitorRecordType and Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c  AND 
    GTM__r.Sales_Rep__c=:userInfo.getUserId() AND GTM__r.Fiscal_Year__c=:year  order by  GTM_Customer__r.Name ASC];
    }else{
        gtmDetails = [select id,GTM_Customer__c, GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Competitor_Name_1__c,Competitor_Name_1__r.Name,Indicate_share_wallet_of_competitor_1__c,Competitor_Name_2__c,Indicate_share_wallet_of_competitor_2__c,Competitor_Name_3__c,Indicate_share_wallet_of_competitor_3__c,Competitor_Name_4__c,Indicate_share_wallet_of_competitor_4__c,Competitor_Name_5__c,Indicate_share_wallet_of_competitor_5__c,Competitor_Name_6__c,Indicate_share_wallet_of_competitor_6__c,Competitor_Name_7__c,Indicate_share_wallet_of_competitor_7__c,Competitor_Name_8__c,Indicate_share_wallet_of_competitor_8__c,UPL_Position__c,UPLs_share_of_wallet__c,Competitor_Name_2__r.Name,Competitor_Name_3__r.Name,Competitor_Name_4__r.Name,Competitor_Name_5__r.Name,Competitor_Name_6__r.Name,Competitor_Name_7__r.Name,Competitor_Name_8__r.Name,GTM_Customer__r.Path_Finder__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where recordTypeId=:competitorRecordType and Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c  AND 
        GTM__r.Sales_Rep__r.ManagerId=:userInfo.getUserId() AND GTM__r.Fiscal_Year__c=:year  order by  GTM_Customer__r.Name ASC];
    }
    if(gtmDetails.size()==0){
        return createGTMDetail(year);
    }
        return gtmDetails;
}
    
public static List<GTM_Details__c> createGTMDetail(String year){
    List<Account> gtmCustomers = GTMPathFinder.getGTMCustomers();
    System.debug('The Gtm Customer size' +gtmCustomers.size());
    List<GTM_Details__c> gtmDetailstToInsert = new List<GTM_Details__c>();
    Id competitorRecordType = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Competitor').getRecordTypeId();
    List<GTM__c> gtms = new  List<GTM__c>();
    Id userId = userInfo.getUserId();
        gtms = [SELECT ID,Name,Fiscal_Year__c,Email__c from GTM__c where Fiscal_Year__c=:year and Sales_Org__c=:salesOrg.Id and Sales_Rep__c=:userId];
        User userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Id,UserRole.Name FROM User where Id=:userId ];
        GTM__c gtm = new GTM__c();
        if(gtms.size()==0){
            gtm.Fiscal_Year__c = year;
            gtm.GTM_Status__c = 'Draft';
            gtm.Sales_Org__c = salesOrg.Id;
            gtm.Sales_Rep__c = userInfo.getUserId();
            gtm.Sales_Rep_Name__c = userInfo.getName();
            gtm.Role__c = userDetails.UserRole.Name;
            gtm.Email__c=userDetails.Email;
            if(Schema.sObjectType.GTM__c.isCreateable() && profileName!='Admin/KeyUser Mexico'){
                System.debug('Create GTM');
                insert gtm;
                gtms.add(gtm);
            }else{
                System.debug('Please provide GTM__c Create Access to the profile');
            }
        }
        List<GTM_Details__c> gtmPotentialProfile = new List<GTM_Details__c>();
        if(GTMPathFinder.isGTMProfileAndPotentialCreated(year)==false){
            GTMPathFinder.createGTMPotentialAndProfile(gtms[0]);
        }
        gtmPotentialProfile = GTMPathFinder.getGTMPotentialProfile(year);

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
    if(gtms.size()>0 && profileName!='Admin/KeyUser Mexico'){
    insert gtmDetailstToInsert;
    }
    List<GTM_Details__c> gtmDetails =[select GTM_Customer__c, GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,Competitor_Name_1__c,Competitor_Name_1__r.Name,Indicate_share_wallet_of_competitor_1__c,Competitor_Name_2__c,Indicate_share_wallet_of_competitor_2__c,Competitor_Name_3__c,Indicate_share_wallet_of_competitor_3__c,Competitor_Name_4__c,Indicate_share_wallet_of_competitor_4__c,Competitor_Name_5__c,Indicate_share_wallet_of_competitor_5__c,Competitor_Name_6__c,Indicate_share_wallet_of_competitor_6__c,Competitor_Name_7__c,Indicate_share_wallet_of_competitor_7__c,Competitor_Name_8__c,Indicate_share_wallet_of_competitor_8__c,UPL_Position__c,UPLs_share_of_wallet__c,Competitor_Name_2__r.Name,Competitor_Name_3__r.Name,Competitor_Name_4__r.Name,Competitor_Name_5__r.Name,Competitor_Name_6__r.Name,Competitor_Name_7__r.Name,Competitor_Name_8__r.Name,GTM_Customer__r.Path_Finder__c,isSubmitted__c,GTM_Customer__r.recordTypeId from GTM_Details__c where recordTypeId=:competitorRecordType and  Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c AND 
    GTM__r.Sales_Rep__c=:userInfo.getUserId() AND GTM__r.Fiscal_Year__c=:year order by  GTM_Customer__r.Name ASC];
    System.debug('Gtm details size' +gtmDetails.size());
    return gtmDetails;
  
  }
  @AuraEnabled
  public static GTM_Details__c  updateGTMDetails(GTM_Details__c upgtm)
  {
    update upgtm;
    return upgtm;
 }
 @AuraEnabled
 public static GTM_Details__c  updateshare(String recordId)
 {

    GTM_Details__c upshare=[select Id,GTM_Customer__c,GTM_Customer__r.Name,GTM_Customer__r.Lead_Customer__c,UPL_Position__c,UPLs_share_of_wallet__c,GTM_Customer__r.Path_Finder__c from GTM_Details__c where Id=:recordId];
    upshare.UPL_Position__c=null;
    upshare.UPLs_share_of_wallet__c=null;
    
    update upshare;
    return upshare;

 }


  @AuraEnabled
 public static List<CompetitorWrapper> getCompetitorDetails()
 {
     List<Competitior_Sales_Org_Mapping__c> comp= [Select Id, Competitor__r.Name ,Display_Name__c,Status__c,Competitor__c from Competitior_Sales_Org_Mapping__c where Status__c ='Active' and Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c];
     
     List<CompetitorWrapper> wrap=new List <CompetitorWrapper>();
     for(Competitior_Sales_Org_Mapping__c  a:comp)
     {
        CompetitorWrapper wrapper =new CompetitorWrapper();   
         if(!String.isEmpty(a.Display_Name__c))
         {
             wrapper.competitiorId=a.Competitor__c;
             wrapper.competitiorname=a.Display_Name__c;

         }
         else
         {
            wrapper.competitiorId=a.Competitor__c;
            wrapper.competitiorname=a.Competitor__r.Name;
        
        }
        
        wrap.add(wrapper);
        
     }
     return wrap;
     
 }

 @AuraEnabled
 public static List<GTM__c> getGtm(String year)
 {
    List<GTM__c> gtmp = new  List<GTM__c>();
    Id userId = userInfo.getUserId();
        gtmp = [Select Id,Name,Fiscal_Year__c,Email__c,Role__c,Sales_Rep_Name__c,Sales_org__r.name from GTM__c where  Fiscal_Year__c=:year and Sales_Org__r.Sales_Org_Code__c=:salesorg.Sales_Org_Code__c and Sales_Rep__c=:userId];
       
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
   class CompetitorWrapper
   {
       @AuraEnabled
       public  String competitiorname;
       @AuraEnabled
       public  String competitiorId ;

       public CompetitorWrapper(String competitiorId,String competitiorname)
       {
          this.competitiorname=competitiorname;
          this.competitiorId=competitiorId;
       }
       public CompetitorWrapper()
       {

       }

   }
    
 }