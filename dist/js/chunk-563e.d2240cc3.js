(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-563e"],{6408:function(p,o,t){"use strict";t.r(o);var n=function(){var p=this,o=p.$createElement,t=p._self._c||o;return t("div",{staticClass:"popup-wrapper"},[t("portal-target",{attrs:{name:"event-popup","slot-props":p.popup_scope}})],1)},e=[],s={props:["appointmentProps"],beforeMount:function(){this.popup_scope["appointment_props"]=this.appointmentProps,this.appointmentProps.hasOwnProperty("form_data")?this.popup_scope.status="existing":this.popup_scope.status="new"},data:function(){return{popup_scope:{close_popup:!1,status:null,appointment_props:null}}},mounted:function(){this.$on("completedForm",function(){console.log("completed form in eventpopup.vue")})},watch:{popup_scope:{handler:function(p){p.close_popup&&(console.log("Closing popup."),this.$emit("closePopup"))},deep:!0}}},u=s,c=(t("c76b"),t("2877")),i=Object(c["a"])(u,n,e,!1,null,null,null);o["default"]=i.exports},"6e35":function(p,o,t){},c76b:function(p,o,t){"use strict";var n=t("6e35"),e=t.n(n);e.a}}]);
//# sourceMappingURL=chunk-563e.d2240cc3.js.map