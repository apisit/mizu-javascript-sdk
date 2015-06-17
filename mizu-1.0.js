/*!
* Mizu JavaScript SDK
* Version: 1.0
* Created: Tue May 12 2015.
* httpw://www.getmizu.com
*
* Copyright 2015 Apisit Toompakdee
* The Mizu JavaScript SDK is freely distributable under the MIT license.
*
*/
(function(root) {
	root.Mizu = root.Mizu || {};
	root.Mizu.VERSION = "1.0";
	root.Mizu.baseUrl = "https://www.getmizu.com/api/v1";
	root.Mizu.apiKey = "";
	root.Mizu.applicationId = "";
}(this));

(function() {
	var root = this;


//Cal this method to initialize appliationId and apiKey for Mizu.
Mizu.init = function(applicationId, apiKey) {
	Mizu.applicationId = applicationId;
	Mizu.apiKey = apiKey;
};

Mizu.supportedCountries = function(success,error){
	url = Mizu.baseUrl + "/settings/supportedcountries";
	Mizu._request("GET",url,null,success,error);
};

Mizu.geoLookup = function(address,success,error){
	url = Mizu.baseUrl + "/tools/geo?a=" + address;
	Mizu._request("GET",url,null,success,error);
};

Mizu.myBusinesses = function(success,error){
	url = Mizu.baseUrl + "/owner/businesses";
	Mizu._requestUserProtectedResource("GET",url,null,success,error);
};

Mizu.itemTags = function(success,error){
	url = Mizu.baseUrl + "/tags/item";
	Mizu._request("GET",url,null,success,error);
};

Mizu.businessTags = function(success,error){
	url = Mizu.baseUrl + "/tags/business";
	Mizu._request("GET",url,null,success,error);
};

Mizu.searchBusinessesToClaim = function(name,address,success,error){
	url = Mizu.baseUrl + "/businesses/claiming?name=" + name +"&address=" + address;
	Mizu._request("GET",url,null,success,error);
};

Mizu.businessesToClaimOnMap= function(lat,lng,success,error){
	url = Mizu.baseUrl + "/businesses/claiming/map?lat=" + lat +"&lng=" + lng;
	Mizu._request("GET",url,null,success,error);
};


Mizu.claimedBusinesses = function(success,error){
	url = Mizu.baseUrl + "/users/me/claims";
	Mizu._requestUserProtectedResource("GET",url,null,success,error);
};

Mizu.claimThisBusiness = function(business,success,error){
	url = Mizu.baseUrl + "/businesses/" + business.id + "/claim";
	Mizu._requestUserProtectedResource("POST",url,null,success,error);
};

Mizu.analyticsViewMenusByBusiness = function(business,success,error){
	url = Mizu.baseUrl + "/analytics/businesses/" + business.id + "/" + business.name +"/viewmenus";
	Mizu._requestUserProtectedResource("GET",url,null,success,error);
};

Mizu.recentActivitiesByBusiness = function(business,limit,success,error){
	if (limit ==="") {
		limit = "50";
	}
	url = Mizu.baseUrl + "/businesses/" + business.id + "/activities/recent?limit=" + limit;
	Mizu._requestUserProtectedResource("GET",url,null,success,error);
};

Mizu.mostActiveItems = function(business,success,error){
	url = Mizu.baseUrl + "/businesses/" + business.id + "/items/mostactive";
	Mizu._requestUserProtectedResource("GET",url,null,success,error);
};

Mizu.menusByBusiness = function(business,success,error){
	url = Mizu.baseUrl + "/businesses/" + business.id + "/ownermenus";
	Mizu._requestUserProtectedResource("GET",url,null,success,error);
};

Mizu.saveMenus = function(business,menus,success,error){
	url = Mizu.baseUrl + "/businesses/" + business.id + "/menus";
	Mizu._requestUserProtectedResource("POST",url,JSON.stringify(menus),success,error);
};

Mizu.deleteBusiness = function(business,success,error){
	url = Mizu.baseUrl + "/businesses/" + business.id;
	Mizu._requestUserProtectedResource("DEL",url,null,success,error);
};

Mizu.businessById = function(businessId,success,error){
	url = Mizu.baseUrl + "/businesses/" + businessId;
	Mizu._requestUserProtectedResource("GET",url,null,success,error);
};

Mizu.saveBusiness = function(business,success,error){
	url = Mizu.baseUrl + "/businesses";
	method = "POST";
	if (business.id!==null && business.id!=="" && business.id!==undefined){
		url = Mizu.baseUrl + "/businesses/" + business.id;
		method = "PUT";
	}
	Mizu._requestUserProtectedResource(method,url,JSON.stringify(business),success,error);
};

var setUser = function(data){
	sessionStorage.setItem("__currentUser",btoa(JSON.stringify(data)));
};

var getUser = function(){
	var user = sessionStorage.getItem('__currentUser');
	if (user!==null && user.access_token!=="")
		return JSON.parse(atob(user));
	return null;
};

Mizu.currentUser = function(){
	return getUser();
};

Mizu.toggleBusinessPublishStatus = function(businessId,success,error){
	url = Mizu.baseUrl + "/businesses/" + businessId + "/publish/toggle";
	Mizu._requestUserProtectedResource("PUT",url,null,success,error);
};

Mizu.toggleSubmitForReview = function(businessId,success,error){
	url = Mizu.baseUrl + "/businesses/" + businessId + "/submit";
	Mizu._requestUserProtectedResource("PUT",url,null,success,error);
};

Mizu.resetPassword = function(email,success,error){
	if (email==="" || email===undefined || email===null){
		error("Email cannot be blank",400);
		return;
	}
	url = Mizu.baseUrl + "/forgotpassword";
	var data = JSON.stringify({"email":email});
	Mizu._request("POST",url,data,success,error);
};

Mizu.signup = function(firstname,lastname,email,password,success,error){
	var ajaxSuccess = function(data,status){
		//save this to location storage
		setUser(data);
		success(data,status);
	};
	url = Mizu.baseUrl + "/signup";
	var data = JSON.stringify({"email":email,"password":password,"firstname":firstname,"lastname":lastname});
	Mizu._request("POST",url,data,ajaxSuccess,error);
};

Mizu.logout = function(){
	sessionStorage.removeItem("__currentUser");
};

Mizu.loginWithFacebook = function(facebookToken,email,success,error){
	var ajaxSuccess = function(data,status){
		//save this to location storage
		setUser(data);
		success(data,status);
	};
	url = Mizu.baseUrl + "/signup";
	var data = JSON.stringify({"email":email,"social_account":{"service_name":"facebook","access_token":facebookToken}});
	Mizu._request("POST",url,data,ajaxSuccess,error);
};

Mizu.login =function(email,password,success,error){

	if (email===null || password===null || email==="" || password==="" || email===undefined || password===undefined){
		error("Email or password cannot be blank",400);
		return;
	}

	var ajaxSuccess = function(data,status){
		//save this to location storage
		setUser(data);
		success(data,status);
	};
	url = Mizu.baseUrl + "/login";
	var data = JSON.stringify({"email":email,"password":password});
	Mizu._request("POST",url,data,ajaxSuccess,error);
};

Mizu.updateName = function(firstname,lastname,success,error){

	var ajaxSuccess = function(data,status){
		//update this to location storage
		setUser(data);
		success(data,status);
	};

	url = Mizu.baseUrl + "/users/me";
	var data = JSON.stringify({"first_name":firstname,"last_name":lastname});
	Mizu._requestUserProtectedResource("PUT",url,data,ajaxSuccess,error);
};

Mizu._requestUserProtectedResource = function(method, url, data,success,error){
	Mizu._ajax(true,method,url,data,success,error);
};

Mizu._request = function(method, url, data,success,error){
	Mizu._ajax(false,method,url,data,success,error);
};

Mizu._ajax = function(requireUser,method, url, data,success,error){
	var dispatch = function(){
		if (Mizu.apiKey==="" || Mizu.applicationId===""){
			error("api key and application Id cannot be blank.",0);
			return;
		}

		var currentUser =  Mizu.currentUser();
		if (currentUser===null && requireUser===true){
			error("Authorization required : " + url,401);
			return;
		}
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status != 200){
					try {
						response = JSON.parse(xhr.responseText);
						error(response,xhr.status);
						return;
					} catch (e) {
						if (error) {
							error(xhr.responseText,xhr.status);
						}
					}
					return;
				}

				var response;
				try {
					response = JSON.parse(xhr.responseText);
				} catch (e) {
					if (error) {
						error(xhr,xhr.status);
					}
				}

				if (response && success) {
					success(response,xhr.status);
					return;
				}

				if (!response && error){
					response = JSON.parse(xhr.responseText);
					error(response,xhr.status);
				}
				return;
			}
		};
		xhr.open(method,url,true);
		if (requireUser===true){
			xhr.setRequestHeader("Authorization","Mizu " + Mizu.currentUser().access_token);
		}
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.setRequestHeader('X-Mizu-Rest-API-Key', Mizu.apiKey);
		xhr.setRequestHeader('X-Mizu-Application-Id', Mizu.applicationId);
		xhr.send(data);
	};
	dispatch();
};

})(this);