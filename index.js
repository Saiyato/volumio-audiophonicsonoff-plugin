'use strict';
var libQ = require('kew');
var libNet = require('net');
var fs = require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var Gpio = require('onoff').Gpio;

module.exports = ControllerAudiophonicsOnOff;

function ControllerAudiophonicsOnOff(context) 
{
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;
};

ControllerAudiophonicsOnOff.prototype.onVolumioStart = function()
{
	var self = this;
	self.logger.info("Audiophonics on/off initiated");
	
	this.configFile = this.commandRouter.pluginManager.getConfigurationFile(this.context, 'config.json');
	self.getConf(this.configFile);
	
	return libQ.resolve();	
};

ControllerRaspDac.prototype.onVolumioReboot = function()
{
      var self = this;
      self.softShutdown.writeSync(1);
};

ControllerAudiophonicsOnOff.prototype.onVolumioShutdown = function()
{
      var self = this;
      var defer = libQ.defer();
      
      self.softShutdown.writeSync(1);
      setTimeout(function(){
            self.softShutdown.writeSync(0);
            defer.resolve();
          }, 1000);
      
      return defer;
};

ControllerAudiophonicsOnOff.prototype.getConfigurationFiles = function()
{
	return ['config.json'];
};

// Plugin methods -----------------------------------------------------------------------------
ControllerAudiophonicsOnOff.prototype.onStop = function() {
	var self = this;
	self.logger.info("performing onStop action");
	
	self.shutdownButton.unwatchAll();
	self.shutdownButton.unexport();
	self.bootOk.unexport();
	self.softShutdown.unexport();
	
	return libQ.resolve();
};

ControllerAudiophonicsOnOff.prototype.stop = function() {
	var self = this;
	self.logger.info("performing stop action");
	
	return libQ.resolve();
};

ControllerAudiophonicsOnOff.prototype.onStart = function() {
	var self = this;
	self.logger.info("Configuring GPIO pins");

	self.softShutdown = new Gpio(self.config.get('soft_shutdown'), 'out');
	self.shutdownButton = new Gpio(self.config.get('shutdown_button'), 'in', 'both');
	self.bootOk = new Gpio(self.config.get('boot_ok'), 'high');
	
	self.shutdownButton.watch(self.hardShutdownRequest.bind(this));
	
	return libQ.resolve();
};

ControllerAudiophonicsOnOff.prototype.onRestart = function() 
{
	var self = this;
	self.logger.info("performing onRestart action");
};

ControllerAudiophonicsOnOff.prototype.onInstall = function() 
{
	var self = this;
	self.logger.info("performing onInstall action");
};

ControllerAudiophonicsOnOff.prototype.onUninstall = function() 
{
	// Perform uninstall tasks here!
	self.logger.info("performing onUninstall action");
};

ControllerAudiophonicsOnOff.prototype.getUIConfig = function() {
    var self = this;
	var defer = libQ.defer();    
    var lang_code = this.commandRouter.sharedVars.get('language_code');
	self.getConf(this.configFile);
	self.logger.info("Loaded the previous config.");
		
	self.commandRouter.i18nJson(__dirname+'/i18n/strings_' + lang_code + '.json',
		__dirname + '/i18n/strings_en.json',
		__dirname + '/UIConfig.json')
    .then(function(uiconf)
    {
		self.logger.info("## populating UI...");
		
		// GPIO configuration
		uiconf.sections[0].content[0].value = self.config.get('soft_shutdown');
		uiconf.sections[0].content[1].value = self.config.get('shutdown_button');
		uiconf.sections[0].content[2].value = self.config.get('boot_ok');		
		self.logger.info("1/1 settings loaded");
		
		self.logger.info("Populated config screen.");
		
		defer.resolve(uiconf);
	})
	.fail(function()
	{
		defer.reject(new Error());
	});

	return defer.promise;
};

ControllerAudiophonicsOnOff.prototype.setUIConfig = function(data) {
	var self = this;
	
	self.logger.info("Updating UI config");
	var uiconf = fs.readJsonSync(__dirname + '/UIConfig.json');
	
	return libQ.resolve();
};

ControllerAudiophonicsOnOff.prototype.getConf = function(configFile) {
	var self = this;
	this.config = new (require('v-conf'))()
	this.config.loadFile(configFile)
	
	return libQ.resolve();
};

ControllerAudiophonicsOnOff.prototype.setConf = function(conf) {
	var self = this;
	return libQ.resolve();
};

// Public Methods ---------------------------------------------------------------------------------------
ControllerAudiophonicsOnOff.prototype.updateButtonConfig = function (data)
{
	var self = this;
	
	self.config.set('soft_shutdown', data['soft_shutdown'].value);
	self.config.set('shutdown_button', data['shutdown_button'].value);
	self.config.set('boot_ok', data['boot_ok']);
		
	return libQ.resolve();
};

// Button Management
ControllerRaspDac.prototype.hardShutdownRequest = function(err, value) {
	self.commandRouter.shutdown();
};