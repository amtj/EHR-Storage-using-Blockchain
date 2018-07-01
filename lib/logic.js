'use strict';

/**
 * Create and store an EHR
 * @param {org.acme.biznet.AllowAdoctorWrite} allowDoctor
 * * @return {Promise} Asset Registry Promise
 * @transaction
 */
function AuthorizeDoctors(allowDoctor){
  		return getAssetRegistry('org.acme.biznet.Patient').then(function(assetRegistery){
			allowDoctor.patient.authorized.push(allowDoctor.DoctorId); 
  			return assetRegistery.update(allowDoctor.patient);
        });
  		throw "Too big";
}


/**
 * Create and store an EHR
 * @param {org.acme.biznet.UpdateRecord} updaterecord
 * * @return {Promise} Asset Registry Promise
 * @transaction
 */

function onUpdateRecord(updaterecord) {
  	      return getAssetRegistry('org.acme.biznet.Medical_Record').then(function(assetRegistery) {
      		var record_id =	updaterecord.record_id;
			record = getFactory().newResource('org.acme.biznet', 'Medical_Record', record_id);
          	return query( 'selectPatients').then(function(results){
                for(var i=0;i<results.length;i++){
                    if(results[i].PatientId==updaterecord.PatientId){
                      
                        for(var j=0;j<results[i].authorized.length;j++){
                          
                            if(updaterecord.DoctorId==results[i].authorized[j]){
                              	//record.record_id=updaterecord.record_id;
                              	record.PatientId=updaterecord.PatientId;
                              	record.DoctorId=updaterecord.DoctorId;
                              	record.version=0;
                              	record.authorized=updaterecord.authorized;
                				record.description=updaterecord.description;
                              	record.prescription=updaterecord.prescription;
                              	record.encounter_time=updaterecord.encounter_time;  
                              	record.location=updaterecord.location;
                                return assetRegistery.add(record); 
                            }
                        }
                    } 	 
                
            	}
            throw "Too big";
            }); 
	});
}

/**
 * Allow a doctor to access a record
 * @param {org.acme.biznet.AllowOtherDoctorsRead} allowAccess 
 * * @return {Promise} Asset Registry Promise
 * @transaction
 */

function allowDoctor(allowAccess){	
	var id=allowAccess.id;
  	var doc2_id=allowAccess.doctor2.DoctorId;
  	
  	return getAssetRegistry('org.acme.biznet.Medical_Record').then(function(assetRegistery) {
    	
      	if(id==allowAccess.record.DoctorId){
          		allowAccess.record.version++;	
        		allowAccess.record.authorized.push(doc2_id);
       			return assetRegistery.update(allowAccess.record);
        }
      	else if(id==allowAccess.record.PatientId){
          		allowAccess.record.version++;	
        		allowAccess.record.authorized.push(doc2_id);
       			return assetRegistery.update(allowAccess.record);
        }
      	else{
             for(var i=0;i<allowAccess.record.authorized.length;i++){
					if(allowAccess.record.authorized[i]==id){
                      		allowAccess.record.version++;
                     		allowAccess.record.authorized.push(doc2_id);	
                      		return assetRegistery.update(allowAccess.record);
                     }
             }
        }
      	throw "Too big";
    });
} 




