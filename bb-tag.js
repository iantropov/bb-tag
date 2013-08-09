$(function(){

  var TagsModel = Backbone.Model.extend({
    defaults: {
      tags: ''
    },

    setTags: function(tags) {
      this.set('tags', tags)
    },

    getTags: function() { return this.get('tags'); }
  });

  var TagsComponent = function(model) {
    this.model = model || new TagsModel();
  };

  _.extend(TagsComponent.prototype, {
 
    enable: function() {
      this.tagsInputElement().tagsInput();
      this.tagsInputElement().importTags(this.model.getTags())
  
      this.model.on('change', this.onTagsModelChanged, this)
    },

    onTagsModelChanged: function(key, value) {
      this.tagsInputElement().importTags(this.model.getTags())
    },

    disable: function() {
      this.destroyTagsInputPlugin(); //quick and dirty way to destroy plugin

      this.model.off('change', this.onTagsModelChanged)
    },

    destroyTagsInputPlugin: function() { 
      $('.tagsinput').remove();
      this.tagsInputElement().show();
    },

    tagsInputElement: function() { return this.tagsInput ? this.tagsInput : this.tagsInput = $('#tags-input') }
  });

  var AppView = Backbone.View.extend({

    el: "body",

    events: {
      "click #enable-component"   : "enableComponent",
      "click #disable-component"  : "disableComponent",
      "click #populate-component" : "populateComponent"
    },

    initialize: function() {
      this.populateInput = this.$("#populate-input");

      this.tagsModel = new TagsModel;
      this.tagsComponent = new TagsComponent(this.tagsModel)
    },

    enableComponent: function() {
      if (this.tagsComponentEnabled) return;

      this.tagsComponent.enable();
      this.tagsComponentEnabled = true; 
    },

    disableComponent: function() { 
      this.tagsComponent.disable();
      this.tagsComponentEnabled = false; 
    },

    populateComponent: function() {
      var newTags = this.populateInput.val();
      this.tagsModel.setTags(newTags);
    }

  });

  var App = new AppView;
});
