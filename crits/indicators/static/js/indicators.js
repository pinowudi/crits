$(document).ready(function() {
    $('[id^="accordion"]').accordion({
                    collapsible: true,
                    active: false,
                    autoHeight: false,
                    navigation: true
    });

    $('.slider').slider({
        min:1,
        max:5,
        step:1,
        slide:function(e, ui) {
            $(this).css('background',$(this).data('colors')[ui.value]);
            $(this).find("a:first").text($(this).data('confs')[ui.value-1]);
        },
        create:function(e, ui) {
            //var confs = {'unknown': 1, 'benign': 2, 'low': 3, 'medium': 4,
            //'high': 5};
            var confs = ['unknown', 'benign', 'low', 'medium', 'high'];
            var rating = confs.indexOf($(this).attr('rating'))+1;
            var colors = {1:"gray", 2:"green", 3:"yellow", 4:"orange", 5:"red"};

            $(this).slider('value', rating);
            $(this).data('colors', colors);
            $(this).data('confs', confs);
            $(this).css('background',$(this).data('colors')[rating]);
            $(this).find("a:first").text($(this).data('confs')[rating-1]);
        },
        stop:function(e, ui) {
            $.ajax({
                type: "POST",
                data: {'value':$(this).data('confs')[ui.value-1]},
                url: $(this).attr('action'),
                success: function(data) {
                    if (!data.success && data.message) {
                        error_message_dialog('Update Analysis Error', data.message);
                    }
                }
            });
        }
    }).css('width',"38%");

    // XXXX Some of this needs to be converted.
    $("#download-indicator-form").dialog({
        autoOpen: false,
        modal: true,
        width: "auto",
        height: "auto",
        buttons: {
            "Download Indicator": function () {
                $("#form-download-indicator").submit();
                $(this).dialog("close");
            },
            "Cancel": function() {
                $(this).dialog("close");
            },
        },

        create: function() {
            var meta = $("#id_meta_format");
            var bin = $("#id_binary_format");
            var no_meta = $(meta).children("option[value='none']");
            var no_bin = $(bin).children("option[value='none']");

            //Makes no sense to download empty file, so either binaries or metadata have to be downloaded.
            //don't allow user to select downloading neither
            var mutually_exc = function(e) {
                //alert($(primary).prop("selected"));
              var elem = e.data['elem'];
                if ($(this).val() == "none") {
                    $(elem).hide();
                } else {
                    $(elem).show();
                }
            };
            meta.change({elem: no_bin}, mutually_exc);
            bin.change({elem: no_meta}, mutually_exc);
        },

        close: function() {
            // allFields.val("").removeClass("ui-state-error");
        },
    });

    var localDialogs = {
	"download-indicator": {title: "Download Indicator", href:"",
			       submit: function(e) {
		$("#form-download-indicator").submit();
                $(this).dialog("close");
	    }},
	"add-activity": {title: "Activity", href:"",
			 update: { open: update_dialog} },

    };

    $.each(localDialogs, function(id,opt) {
	    stdDialog(id,opt);
	});

    //edit type in place
    $('#indicator_type.edit').editable(function(value, settings) {
        var revert = this.revert;
        return function(value, settings, elem) {
            $.ajax({
                type:"POST",
                async:false,
                url:$(elem).attr('action'),
                data: {'type':value},
                success: function(data) {
                    if (!data.success) {
                        value = revert;
                        $("#indicator_type_error").addClass('ui-icon');
                        $("#indicator_type_error").removeClass('ui-icon-circle-check');
                        $("#indicator_type_error").addClass('ui-icon-alert');
                        $("#indicator_type_error").attr("title", "Duplicate Indicator detected");
                    } else {
                        $("#indicator_type_error").addClass('ui-icon');
                        $("#indicator_type_error").removeClass('ui-icon-alert');
                        $("#indicator_type_error").addClass('ui-icon-circle-check');
                        $("#indicator_type_error").attr("title", "Success!");
                    }
                },
            });
            return value;
        }(value, settings, this);
    },
    {
        type:'select',
        data: (function() {
            var dtypes = {};
            var sorted = [];
            $.ajax({
                type: "POST",
                async: false,
                url: get_indicator_type_dropdown,
                data: {'type': 'indicator_type'},
                success: function(data) {
                    $.each(data.types, function(key, value) {
                        sorted.push(key);
                    });
                    sorted.sort();
                    len = sorted.length;
                    for (var i=0; i < len; i++) {
                        dtypes[sorted[i]] = sorted[i];
                    }
                }
            });
            return dtypes;
        }),
        style:'display:inline',
        submit:'OK'
    });
    //edit threat type in place
    $('#indicator_threat_type.edit').editable(function(value, settings) {
        var revert = this.revert;
        return function(value, settings, elem) {
            $.ajax({
                type:"POST",
                async:false,
                url:$(elem).attr('action'),
                data: {'type':value},
                success: function(data) {
                    if (!data.success) {
                        value = revert;
                        $("#indicator_threat_type_error").addClass('ui-icon');
                        $("#indicator_threat_type_error").removeClass('ui-icon-circle-check');
                        $("#indicator_threat_type_error").addClass('ui-icon-alert');
                        $("#indicator_threat_type_error").attr("title", "Duplicate Indicator detected");
                    } else {
                        $("#indicator_threat_type_error").addClass('ui-icon');
                        $("#indicator_threat_type_error").removeClass('ui-icon-alert');
                        $("#indicator_threat_type_error").addClass('ui-icon-circle-check');
                        $("#indicator_threat_type_error").attr("title", "Success!");
                    }
                },
            });
            return value;
        }(value, settings, this);
    },
    {
        type:'select',
        data: (function() {
            var dtypes = {};
            var sorted = [];
            $.ajax({
                type: "POST",
                async: false,
                url: get_indicator_type_dropdown,
                data: {'type': 'threat_type'},
                success: function(data) {
                    $.each(data.types, function(key, value) {
                        sorted.push(key);
                    });
                    sorted.sort();
                    len = sorted.length;
                    for (var i=0; i < len; i++) {
                        dtypes[sorted[i]] = sorted[i];
                    }
                }
            });
            return dtypes;
        }),
        style:'display:inline',
        submit:'OK'
    });
    //edit attack type in place
    $('#indicator_attack_type.edit').editable(function(value, settings) {
        var revert = this.revert;
        return function(value, settings, elem) {
            $.ajax({
                type:"POST",
                async:false,
                url:$(elem).attr('action'),
                data: {'type':value},
                success: function(data) {
                    if (!data.success) {
                        value = revert;
                        $("#indicator_attack_type_error").addClass('ui-icon');
                        $("#indicator_attack_type_error").removeClass('ui-icon-circle-check');
                        $("#indicator_attack_type_error").addClass('ui-icon-alert');
                        $("#indicator_attack_type_error").attr("title", "Duplicate Indicator detected");
                    } else {
                        $("#indicator_attack_type_error").addClass('ui-icon');
                        $("#indicator_attack_type_error").removeClass('ui-icon-alert');
                        $("#indicator_attack_type_error").addClass('ui-icon-circle-check');
                        $("#indicator_attack_type_error").attr("title", "Success!");
                    }
                },
            });
            return value;
        }(value, settings, this);
    },
    {
        type:'select',
        data: (function() {
            var dtypes = {};
            var sorted = [];
            $.ajax({
                type: "POST",
                async: false,
                url: get_indicator_type_dropdown,
                data: {'type': 'attack_type'},
                success: function(data) {
                    $.each(data.types, function(key, value) {
                        sorted.push(key);
                    });
                    sorted.sort();
                    len = sorted.length;
                    for (var i=0; i < len; i++) {
                        dtypes[sorted[i]] = sorted[i];
                    }
                }
            });
            return dtypes;
        }),
        style:'display:inline',
        submit:'OK'
    });

    // Upload a related pcap (Using the related dialog persona)
    $( "#dialog-new-pcap" ).on("dialogopen.add_related_pcap", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        // $(this).find("form").removeAttr("target"); // Get rid of target to refresh page
        // Unlike new-sample below, this does not redirect us nor refresh the
        // Relationships list of the Sample, so delay for a few seconds then reload the
        // page after uploaded.  Added a fileUploadComplete event to work around this.
        $(this).find("form").bind("fileUploadComplete",
                      function(e, response) {
                          if (response.success)
                          setTimeout(function() {
                              document.location = document.location },
                              3000); });
        }
    });
    // Upload a related Domain (Using the related dialog persona)
    $( "#dialog-new-domain" ).on("dialogopen.add_related_domain", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        }
    });
    // Add a related Actor (Using the related dialog persona)
    $( "#dialog-new-actor" ).on("dialogopen.add_related_actor", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        }
    });
    // Add a related Target (Using the related dialog persona)
    $( "#dialog-new-target" ).on("dialogopen.add_related_target", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        }
    });
    // Add a related Email (Using the related dialog persona)
    $( "#dialog-new-email-eml" ).on("dialogopen.add_related_email", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        // $(this).find("form").removeAttr("target"); // Get rid of target to refresh page

        // Unlike new-sample below, this does not redirect us nor refresh the
        // Relationships list of the Sample, so delay for a few seconds then reload the
        // page after uploaded.  Added a fileUploadComplete event to work around this.
        $(this).find("form").bind("fileUploadComplete",
                      function(e, response) {
                          if (response.success)
                          setTimeout(function() {
                              document.location = document.location },
                              3000); });
        }
    });
    // Add a related Event (Using the related dialog persona)
    $( "#dialog-new-event" ).on("dialogopen.add_related_event", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        }
    });
    // Add a related Exploit (Using the related dialog persona)
    $( "#dialog-new-exploit" ).on("dialogopen.add_related_exploit", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        }
    });
    // Add a related Indicator (Using the related dialog persona)
    $( "#dialog-new-indicator" ).on("dialogopen.add_related_indicator", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        }
    });
    // Add a related IP (Using the related dialog persona)
    $( "#dialog-new-ip" ).on("dialogopen.add_related_ip", function(e) {
        if ($(this).dialog("persona") == "related") {
        $(this).find("form #id_related_id").val(indicator_id);
        $(this).find("form #id_related_type").val("Indicator");
        }
    });

    details_copy_id('Indicator');
    toggle_favorite('Indicator');
}); //document.ready

