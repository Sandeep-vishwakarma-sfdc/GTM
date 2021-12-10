public with sharing class GTMOutlook {

  @AuraEnabled
  public static List < GTM_Details__c > getGTMOutlook() {

      Id gtmOutlookRecordType = Schema.SObjectType.GTM_Details__c.getRecordTypeInfosByName().get('Outlook').getRecordTypeId();
      //Get Accounts List
      List < Account > accList = GTMPathFinder.getGTMCustomers();
      System.debug('List Of Accounts---->' + accList.size());
      Sales_Org__c salesorg = GTMPathFinder.getSalesOrg();
      String fiscalYear = GTMPathFinder.getFiscalYear();
      List < GTM__c > gtmList = [Select Id, Sales_Org__c, Fiscal_Year__c, Sales_Rep__c From GTM__c
          WHERE Sales_Org__r.Sales_Org_Code__c =: salesorg.Sales_Org_Code__c AND Fiscal_Year__c =: fiscalYear
      ];

      System.debug('List Of gtm--->' + gtmList);
      GTM__c gtm;
      if (gtmList.size() == 0) {
          // Creating GTM
          gtm = new GTM__c();
          gtm.Fiscal_Year__c = fiscalYear;
          gtm.GTM_Status__c = 'Draft';
          gtm.Sales_Org__c = salesorg.Id;
          gtm.Sales_Rep__c = userInfo.getUserId();
          gtm.Sales_Rep_Name__c = userInfo.getName();
          //gtm.Role__c = userInfo.getUserRole(); TODO: Need to set user role using Query
          if (Schema.sObjectType.GTM__c.isCreateable()) {
              insert gtm;
          } else {
              System.debug('Please provide GTM__c');
          }
      } else {
          gtm = gtmList[0];
      }

      List < GTM_Details__c > gtmPotentialProfile = new List <GTM_Details__c> ();
      if (GTMPathFinder.isGTMProfileAndPotentialCreated(fiscalyear) == false) {
          GTMPathFinder.createGTMPotentialAndProfile(gtm);
      }
      gtmPotentialProfile = GTMPathFinder.getGTMPotentialProfile(fiscalyear);
      Map <String, GTM_Details__c> mapPotentialProfile = new Map <String, GTM_Details__c > ();

      for (GTM_Details__c gtm1: gtmPotentialProfile) {
          mapPotentialProfile.put(gtm1.GTM_Customer__c, gtm1);
      }

      System.debug('mapPotentialProfile size'+mapPotentialProfile.size());

      List <GTM_Details__c> gtmDetailsList = [Select Id, GTM_Customer__r.Name, GTM_Customer__c, Estimated_Growth_NY_to_2NY__c, Estimated_Growth_PY_to_CY__c, Estimated_Growth_PY_to_NY__c, Sales_Org__c from GTM_Details__c WHERE GTM__r.Fiscal_Year__c =: fiscalYear AND recordTypeId =: gtmOutlookRecordType AND Sales_Org__r.Sales_Org_Code__c =: salesorg.Sales_Org_Code__c AND GTM__r.Sales_Rep__c =: userInfo.getUserId()];


      System.debug('List Of gtmDetails--->' + gtmDetailsList.size());

      if (gtmDetailsList.size() == 0) {
          for (Account acc: accList) {
              system.debug('Inside For Loop' + acc);
              //Create GTM Details
              GTM_Details__c gtmDetailsTemp = new GTM_Details__c();
              gtmDetailsTemp.recordTypeId = gtmOutlookRecordType;
              gtmDetailsTemp.GTM_Customer__c = acc.Id;
              gtmDetailsTemp.Sales_Org__c = salesorg.Id;
              gtmDetailsTemp.GTM__c = gtm.Id;
              System.debug('mapPotentialProfile acc'+acc.Id+' '+mapPotentialProfile.get(acc.Id));
              gtmDetailsTemp.GTM_Details__c = mapPotentialProfile.get(acc.Id).Id;
              gtmDetailsList.add(gtmDetailsTemp);
          }
          if (Schema.sObjectType.GTM_Details__c.isCreateable()) {
              System.debug('insert Details ');
              insert gtmDetailsList;
          } else {
              System.debug('Please provide GTM_Details__c');
          }
      }
      gtmDetailsList = [Select Id, GTM_Customer__r.Name, GTM_Customer__c, Estimated_Growth_NY_to_2NY__c, Estimated_Growth_PY_to_CY__c, Estimated_Growth_PY_to_NY__c, Sales_Org__c from GTM_Details__c WHERE GTM__r.Fiscal_Year__c =: fiscalYear AND recordTypeId =: gtmOutlookRecordType AND  Sales_Org__r.Sales_Org_Code__c =: salesorg.Sales_Org_Code__c AND GTM__r.Sales_Rep__c =: userInfo.getUserId()];
      System.debug('List Of GTM Details last' + gtmDetailsList.size());
      return gtmDetailsList;
  }

  @AuraEnabled
  public static GTM_Details__c updateGtmDetails(String apiName, String value, String recordId) {

      GTM_Details__c updateGtmDetails = [Select Id, GTM_Customer__c, Estimated_Growth_NY_to_2NY__c, Estimated_Growth_PY_to_CY__c, Estimated_Growth_PY_to_NY__c, Sales_Org__c from GTM_Details__c WHERE Id =: recordId];

      if (apiName == 'Estimated_Growth_PY_to_CY__c') {
          updateGtmDetails.Estimated_Growth_PY_to_CY__c = decimal.valueof(value);
      } else if (apiName == 'Estimated_Growth_PY_to_NY__c') {
          updateGtmDetails.Estimated_Growth_PY_to_NY__c = decimal.valueof(value);
      } else if (apiName == 'Estimated_Growth_NY_to_2NY__c') {
          updateGtmDetails.Estimated_Growth_NY_to_2NY__c = decimal.valueof(value);
      }
      update updateGtmDetails;

      return updateGtmDetails;

  }

}