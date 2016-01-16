var Kii;

/// <reference path="KiiContext.ts"/>
/// <reference path="HttpClientCallback.ts"/>
/// <reference path="../../HttpClient.ts" />
/// <reference path="../../HttpClientCallback.ts" />
var $;
var jquery;
(function (jquery) {
    var JQueryClient = (function () {
        function JQueryClient() {
            this.headers = {};
        }
        JQueryClient.prototype.setUrl = function (url) {
            this.url = url;
        };
        JQueryClient.prototype.setMethod = function (method) {
            this.method = method;
        };
        JQueryClient.prototype.setContentType = function (value) {
            this.setHeader('content-type', value);
        };
        JQueryClient.prototype.setHeader = function (key, value) {
            this.headers[key] = value;
        };
        JQueryClient.prototype.setKiiHeader = function (context, authRequired) {
            this.setHeader('x-kii-appid', context.getAppId());
            this.setHeader('x-kii-appkey', context.getAppKey());
            if (authRequired) {
                this.setHeader('authorization', 'bearer ' + context.getAccessToken());
            }
        };
        JQueryClient.prototype.sendText = function (text, callback) {
            var data = {
                url: this.url,
                type: this.method,
                headers: this.headers,
                dataType: 'json',
                scriptCharset: 'utf-8',
                data: text,
                processData: false
            };
            this.sendRequest(data, callback);
        };
        JQueryClient.prototype.sendJson = function (json, callback) {
            this.sendText(JSON.stringify(json), callback);
        };
        JQueryClient.prototype.send = function (callback) {
            var data = {
                url: this.url,
                type: this.method,
                headers: this.headers,
                dataType: 'json',
                scriptCharset: 'utf-8',
                processData: false
            };
            this.sendRequest(data, callback);
        };
        JQueryClient.prototype.sendRequest = function (data, callback) {
            $.ajax(data)
                .done(function (data_, status, data) {
                if (data.status == 204) {
                    callback.onReceive(data.status, data.getAllResponseHeaders(), {});
                }
                else {
                    callback.onReceive(data.status, data.getAllResponseHeaders(), JSON.parse(data.responseText));
                }
            }).fail(function (data) {
                callback.onError(data.status, data.responseText);
            });
        };
        return JQueryClient;
    })();
    jquery.JQueryClient = JQueryClient;
})(jquery || (jquery = {}));
/// <reference path="HttpClient.ts" />
/// <reference path="kii/jquery/JQueryClient.ts" />

(function (Kii) {
    var KiiContext = (function () {
        function KiiContext(appId, appKey, url) {
            this.appId = appId;
            this.appKey = appKey;
            this.url = url;
            this.clientFactory = function () {
                return new jquery.JQueryClient();
            };
        }
        KiiContext.prototype.getAppId = function () {
            return this.appId;
        };
        KiiContext.prototype.getAppKey = function () {
            return this.appKey;
        };
        KiiContext.prototype.getServerUrl = function () {
            return this.url;
        };
        KiiContext.prototype.setAccessToken = function (value) {
            this.token = value;
        };
        KiiContext.prototype.getAccessToken = function () {
            return this.token;
        };
        KiiContext.prototype.setDeviceId = function (value) {
            this.deviceId = value;
        };
        KiiContext.prototype.getDeviceId = function () {
            return this.deviceId;
        };
        KiiContext.prototype.setClientFactory = function (factory) {
            this.clientFactory = factory;
        };
        KiiContext.prototype.getNewClient = function () {
            return this.clientFactory();
        };
        return KiiContext;
    })();
    Kii.KiiContext = KiiContext;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiApp = (function () {
        function KiiApp() {
        }
        KiiApp.prototype.getPath = function () {
            return '';
        };
        return KiiApp;
    })();
    Kii.KiiApp = KiiApp;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiUser = (function () {
        function KiiUser(id) {
            this.id = id;
        }
        KiiUser.prototype.getId = function () {
            return this.id;
        };
        KiiUser.prototype.getPath = function () {
            return '/users/' + this.id;
        };
        KiiUser.prototype.getSubject = function () {
            return 'UserID:' + this.id;
        };
        return KiiUser;
    })();
    Kii.KiiUser = KiiUser;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiGroup = (function () {
        function KiiGroup(id) {
            this.id = id;
            this.members = [];
        }
        KiiGroup.prototype.getId = function () {
            return this.id;
        };
        KiiGroup.prototype.removeMember = function (member) {
            var index = -1;
            for (var i = 0; i < this.members.length; ++i) {
                if (this.members[i].id === member.id) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                return;
            }
            this.members.splice(index, 1);
        };
        KiiGroup.prototype.getPath = function () {
            return '/groups/' + this.id;
        };
        KiiGroup.prototype.getSubject = function () {
            return 'GroupID:' + this.id;
        };
        return KiiGroup;
    })();
    Kii.KiiGroup = KiiGroup;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiBucket = (function () {
        function KiiBucket(owner, name) {
            this.owner = owner;
            this.name = name;
        }
        KiiBucket.prototype.getName = function () {
            return this.name;
        };
        KiiBucket.prototype.getPath = function () {
            return this.owner.getPath() + '/buckets/' + this.name;
        };
        return KiiBucket;
    })();
    Kii.KiiBucket = KiiBucket;
})(Kii || (Kii = {}));
/// <reference path="KiiBucket.ts"/>

(function (Kii) {
    var KiiObject = (function () {
        function KiiObject(bucket, id, data) {
            this.bucket = bucket;
            this.id = id;
            this.data = data;
        }
        KiiObject.prototype.getId = function () {
            return this.id;
        };
        KiiObject.prototype.getPath = function () {
            return this.bucket.getPath() +
                '/objects/' + this.id;
        };
        return KiiObject;
    })();
    Kii.KiiObject = KiiObject;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiTopic = (function () {
        function KiiTopic(owner, name) {
            this.owner = owner;
            this.name = name;
        }
        KiiTopic.prototype.getName = function () {
            return this.name;
        };
        KiiTopic.prototype.getPath = function () {
            return this.owner.getPath() + '/topics/' + this.name;
        };
        return KiiTopic;
    })();
    Kii.KiiTopic = KiiTopic;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiThing = (function () {
        function KiiThing(id) {
            this.id = id;
        }
        KiiThing.prototype.getId = function () {
            return this.id;
        };
        KiiThing.prototype.getPath = function () {
            return '/things/' + this.id;
        };
        return KiiThing;
    })();
    Kii.KiiThing = KiiThing;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiGCMMessage = (function () {
        function KiiGCMMessage() {
            this.data = {};
            this.enable = true;
        }
        KiiGCMMessage.prototype.setEnabled = function (value) {
            this.enable = value;
        };
        KiiGCMMessage.prototype.toJson = function () {
            var json = {
                "enabled": this.enable
            };
            if (Object.keys(this.data).length > 0) {
                json['data'] = this.data;
            }
            return json;
        };
        return KiiGCMMessage;
    })();
    Kii.KiiGCMMessage = KiiGCMMessage;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiAPNsMessage = (function () {
        function KiiAPNsMessage() {
            this.data = {};
            this.enable = true;
        }
        KiiAPNsMessage.prototype.setEnabled = function (value) {
            this.enable = value;
        };
        KiiAPNsMessage.prototype.toJson = function () {
            var json = {
                "enabled": this.enable
            };
            if (Object.keys(this.data).length > 0) {
                json['data'] = this.data;
            }
            return json;
        };
        return KiiAPNsMessage;
    })();
    Kii.KiiAPNsMessage = KiiAPNsMessage;
})(Kii || (Kii = {}));
/// <reference path="KiiGCMMessage.ts"/>
/// <reference path="KiiAPNsMessage.ts"/>

(function (Kii) {
    var KiiTopicMessage = (function () {
        function KiiTopicMessage() {
            this.data = {};
            this.sendToDevelopment = true;
            this.sendToProduction = true;
            this.pushMessageType = '';
            this.sendAppID = false;
            this.sendSender = true;
            this.sendWhen = false;
            this.sendOrigin = false;
            this.sendObjectScope = true;
            this.sendTopicID = true;
            this.gcm = new Kii.KiiGCMMessage();
            this.apns = new Kii.KiiAPNsMessage();
        }
        KiiTopicMessage.prototype.setSendToDevelopment = function (value) {
            this.sendToDevelopment = value;
        };
        KiiTopicMessage.prototype.setSendToProduction = function (value) {
            this.sendToProduction = value;
        };
        KiiTopicMessage.prototype.setPushMessageType = function (value) {
            this.pushMessageType = value;
        };
        KiiTopicMessage.prototype.setSendAppID = function (value) {
            this.sendAppID = value;
        };
        KiiTopicMessage.prototype.setSendSender = function (value) {
            this.sendSender = value;
        };
        KiiTopicMessage.prototype.setSendWhen = function (value) {
            this.sendWhen = value;
        };
        KiiTopicMessage.prototype.setSSendOrigin = function (value) {
            this.sendOrigin = value;
        };
        KiiTopicMessage.prototype.setSendObjectScope = function (value) {
            this.sendObjectScope = value;
        };
        KiiTopicMessage.prototype.setSendTopicID = function (value) {
            this.sendTopicID = value;
        };
        KiiTopicMessage.prototype.toJson = function () {
            var json = {
                "sendToDevelopment": this.sendToDevelopment,
                "sendToProduction": this.sendToProduction,
                "pushMessageType": this.pushMessageType,
                "sendAppID": this.sendAppID,
                "sendSender": this.sendSender,
                "sendWhen": this.sendWhen,
                "sendOrigin": this.sendOrigin,
                "sendObjectScope": this.sendObjectScope,
                "sendTopicID": this.sendTopicID,
                "gcm": this.gcm.toJson(),
                "apns": this.apns.toJson()
            };
            if (Object.keys(this.data).length > 0) {
                json['data'] = this.data;
            }
            return json;
        };
        return KiiTopicMessage;
    })();
    Kii.KiiTopicMessage = KiiTopicMessage;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiEvent = (function () {
        function KiiEvent(type) {
            this.data = {
                '_type': type,
                '_triggeredAt': new Date().getTime()
            };
        }
        return KiiEvent;
    })();
    Kii.KiiEvent = KiiEvent;
})(Kii || (Kii = {}));

(function (Kii) {
    var KiiClause = (function () {
        function KiiClause(type) {
            this.clause = {
                'type': type
            };
        }
        KiiClause.all = function () {
            return new KiiClause('all');
        };
        KiiClause.equals = function (field, value) {
            var c = new KiiClause('eq');
            c.clause['field'] = field;
            c.clause['value'] = value;
            return c;
        };
        KiiClause.greaterThan = function (field, value, include) {
            var c = new KiiClause('range');
            c.clause['field'] = field;
            c.clause['lowerLimit'] = value;
            c.clause['lowerIncluded'] = include;
            return c;
        };
        KiiClause.lessThan = function (field, value, include) {
            var c = new KiiClause('range');
            c.clause['field'] = field;
            c.clause['upperLimit'] = value;
            c.clause['upperIncluded'] = include;
            return c;
        };
        KiiClause.range = function (field, fromValue, fromInclude, toValue, toInclude) {
            var c = new KiiClause('range');
            c.clause['field'] = field;
            c.clause['lowerLimit'] = fromValue;
            c.clause['lowerIncluded'] = fromInclude;
            c.clause['upperLimit'] = toValue;
            c.clause['upperIncluded'] = toInclude;
            return c;
        };
        KiiClause.inClause = function (field, values) {
            var c = new KiiClause('in');
            c.clause['field'] = field;
            c.clause['values'] = values;
            return c;
        };
        KiiClause.not = function (clause) {
            var c = new KiiClause('not');
            c.clause['clause'] = clause.toJson();
            return c;
        };
        KiiClause.andClause = function (array) {
            var c = new KiiClause('and');
            c.clause['clauses'] = KiiClause.toClauses(array);
            return c;
        };
        KiiClause.orClause = function (array) {
            var c = new KiiClause('or');
            c.clause['clauses'] = KiiClause.toClauses(array);
            return c;
        };
        KiiClause.toClauses = function (array) {
            for (var i = 0; i < array.length; ++i) {
                array[i] = array[i].toJson();
            }
            return array;
        };
        KiiClause.prototype.toJson = function () {
            return this.clause;
        };
        return KiiClause;
    })();
    Kii.KiiClause = KiiClause;
})(Kii || (Kii = {}));
/// <reference path="KiiClause.ts"/>

(function (Kii) {
    var QueryParams = (function () {
        function QueryParams(clause) {
            this.clause = clause;
            this.orderBy = null;
            this.descending = false;
            this.paginationKey = null;
            this.limit = 0;
        }
        QueryParams.prototype.sortByAsc = function (field) {
            this.orderBy = field;
            this.descending = false;
        };
        QueryParams.prototype.sortByDesc = function (field) {
            this.orderBy = field;
            this.descending = true;
        };
        QueryParams.prototype.setLimit = function (limit) {
            this.limit = limit;
        };
        QueryParams.prototype.setPaginationKey = function (key) {
            if (typeof key == 'undefined') {
                key = null;
            }
            this.paginationKey = key;
        };
        QueryParams.prototype.hasNext = function () {
            return this.paginationKey != null;
        };
        QueryParams.prototype.toJson = function () {
            var query = {
                'clause': this.clause.toJson()
            };
            if (this.orderBy != null) {
                query['orderBy'] = this.orderBy;
                query['descending'] = this.descending;
            }
            var json = {
                'bucketQuery': query
            };
            if (this.limit > 0) {
                json['bestEffortLimit'] = this.limit;
            }
            if (this.paginationKey != null) {
                json['paginationKey'] = this.paginationKey;
            }
            return json;
        };
        return QueryParams;
    })();
    Kii.QueryParams = QueryParams;
})(Kii || (Kii = {}));
/// <reference path="AppAPI.ts" />
/// <reference path="KiiUser.ts" />
/// <reference path="AppAPI.ts"/>
/// <reference path="KiiUser.ts"/>
/// <reference path="KiiGroup.ts"/>
/// <reference path="AppAPI.ts"/>
/// <reference path="KiiBucket.ts"/>
/// <reference path="QueryParams.ts"/>
/// <reference path="AppAPI.ts"/>
/// <reference path="KiiBucket.ts"/>
/// <reference path="AppAPI.ts"/>
/// <reference path="AppAPI.ts"/>
/// <reference path="KiiTopicMessage.ts"/>
/// <reference path="KiiUser.ts" />
/// <reference path="KiiThing.ts" />
/// <reference path="KiiTopic.ts" />
/// <reference path="QueryParams.ts" />
/// <reference path="KiiObject.ts" />
/// <reference path="UserAPI.ts" />
/// <reference path="GroupAPI.ts" />
/// <reference path="BucketAPI.ts" />
/// <reference path="ObjectAPI.ts" />
/// <reference path="ACLAPI.ts" />
/// <reference path="TopicAPI.ts" />
/// <reference path="KiiEvent.ts" />
/// <reference path="../KiiContext.ts" />
/// <reference path="../AppAPI.ts" />
/// <reference path="../KiiUser.ts"/>
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpClientCallback.ts" />
/// <reference path="../UserAPI.ts" />

(function (Kii) {
    var KiiUserAPI = (function () {
        function KiiUserAPI(context) {
            this.context = context;
        }
        KiiUserAPI.prototype.fetchUser = function (id, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/users/' + id;
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('GET');
            client.setKiiHeader(c, true);
            var respUser;
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        respUser = user;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    var user = new Kii.KiiUser(id);
                    user.data = body;
                    callback.success(user);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respUser;
        };
        KiiUserAPI.prototype.changePassword = function (user, current, newPassword, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                user.getPath() +
                '/password';
            var body = {
                'oldPassword': current,
                'newPassword': newPassword
            };
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setContentType('application/vnd.kii.ChangePasswordRequest+json');
            client.setKiiHeader(c, true);
            client.sendJson(body, {
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        KiiUserAPI.prototype.resetPassword = function (email, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/users/EMAIL:' + email +
                '/password/request-reset';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, false);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        KiiUserAPI.prototype.update = function (user, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                user.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setContentType('application/vnd.kii.UserUpdateRequest+json');
            client.setKiiHeader(c, true);
            var respUser;
            client.sendJson(user.data, {
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        respUser = user;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(user);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respUser;
        };
        KiiUserAPI.prototype.updateEmail = function (user, email, verified, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                user.getPath() +
                '/email-address';
            var body = {
                'emailAddress': email
            };
            if (verified) {
                body['verified'] = true;
            }
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setContentType('application/vnd.kii.EmailAddressModificationRequest+json');
            client.setKiiHeader(c, true);
            var respUser;
            client.sendJson(body, {
                onReceive: function (status, headers, body) {
                    user.data['emailAddress'] = email;
                    if (verified) {
                        user.data['emailAddressVerified'] = true;
                    }
                    if (callback === undefined) {
                        respUser = user;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(user);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respUser;
        };
        KiiUserAPI.prototype.updatePhone = function (user, phone, verified, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                user.getPath() +
                '/phone-number';
            var body = {
                'phoneNumber': phone
            };
            if (verified) {
                body['verified'] = true;
            }
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setContentType('application/vnd.kii.PhoneNumberModificationRequest+json');
            client.setKiiHeader(c, true);
            var respUser;
            client.sendJson(body, {
                onReceive: function (status, headers, body) {
                    user.data['phoneNumber'] = phone;
                    if (verified) {
                        user.data['phoneNumberVerified'] = true;
                    }
                    if (callback === undefined) {
                        respUser = user;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(user);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respUser;
        };
        KiiUserAPI.prototype.verifyPhone = function (user, code, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                user.getPath() +
                '/phone-number/verify';
            var body = {
                'verificationCode': code
            };
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setContentType('application/vnd.kii.AddressVerificationRequest+json');
            client.setKiiHeader(c, true);
            var respUser;
            client.sendJson(body, {
                onReceive: function (status, headers, body) {
                    user.data['phoneNumberVerified'] = true;
                    if (callback === undefined) {
                        respUser = user;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(user);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respUser;
        };
        KiiUserAPI.prototype.installDevice = function (user, os, token, development, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/installations';
            var body = {
                'installationRegistrationID': token,
                'deviceType': os
            };
            if (user != null) {
                body['userID'] = user.getId();
            }
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, true);
            client.setContentType('application/vnd.kii.InstallationCreationRequest+json');
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        KiiUserAPI.prototype.subscribe = function (user, target, callback) {
            var targetPath = target.getPath();
            if (targetPath.lastIndexOf('/buckets', 0) == 0) {
                targetPath += '/filters/all';
            }
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                targetPath +
                '/push/subscriptions' +
                user.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, true);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        KiiUserAPI.prototype.unsubscribe = function (user, target, callback) {
            var targetPath = target.getPath();
            if (targetPath.lastIndexOf('/buckets', 0) == 0) {
                targetPath += '/filters/all';
            }
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                targetPath +
                '/push/subscriptions' +
                user.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('DELETE');
            client.setKiiHeader(c, true);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        return KiiUserAPI;
    })();
    Kii.KiiUserAPI = KiiUserAPI;
})(Kii || (Kii = {}));
/// <reference path="../KiiContext.ts" />
/// <reference path="../AppAPI.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpClientCallback.ts" />
/// <reference path="../GroupAPI.ts" />

(function (Kii) {
    var KiiGroupAPI = (function () {
        function KiiGroupAPI(context) {
            this.context = context;
        }
        KiiGroupAPI.prototype.create = function (name, owner, members, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/groups';
            var idList = new Array();
            members.forEach(function (item) {
                idList.push(item.id);
            });
            var body = {
                'name': name,
                'owner': owner.id,
                'members': idList
            };
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setContentType('application/vnd.kii.GroupCreationRequest+json');
            client.setKiiHeader(c, true);
            var respGroup;
            client.sendJson(body, {
                onReceive: function (status, headers, body) {
                    var id = body['groupID'];
                    if (callback === undefined) {
                        respGroup = new Kii.KiiGroup(id);
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(new Kii.KiiGroup(id));
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respGroup;
        };
        KiiGroupAPI.prototype.fetchGroup = function (id, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/groups/' + id;
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('GET');
            client.setKiiHeader(c, true);
            var respGroup;
            client.send({
                onReceive: function (status, headers, body) {
                    var id = body['groupID'];
                    var name = body['name'];
                    var ownerId = body['owner'];
                    var group = new Kii.KiiGroup(id);
                    group.name = name;
                    group.owner = new Kii.KiiUser(ownerId);
                    if (callback === undefined) {
                        respGroup = group;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(group);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respGroup;
        };
        KiiGroupAPI.prototype.updateGroupName = function (group, name, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                group.getPath() +
                '/name';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setContentType('text/plain');
            client.setKiiHeader(c, true);
            var respGroup;
            client.sendText(name, {
                onReceive: function (status, headers, body) {
                    group.name = name;
                    if (callback === undefined) {
                        respGroup = group;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(group);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respGroup;
        };
        KiiGroupAPI.prototype.updateGroupOwner = function (group, owner, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                group.getPath() +
                '/owner';
            var body = {
                'owner': owner.id
            };
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setContentType('application/vnd.kii.GroupOwnerChangeRequest+json');
            client.setKiiHeader(c, true);
            var respGroup;
            client.sendJson(body, {
                onReceive: function (status, headers, body) {
                    group.owner = owner;
                    if (callback === undefined) {
                        respGroup = group;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(group);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respGroup;
        };
        KiiGroupAPI.prototype.deleteGroup = function (group, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                group.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('DELETE');
            client.setKiiHeader(c, true);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        KiiGroupAPI.prototype.getJoinedGroups = function (user, callback) {
            return this.getGroups(user, 'is_member', callback);
        };
        KiiGroupAPI.prototype.getOwnedGroups = function (user, callback) {
            return this.getGroups(user, 'owner', callback);
        };
        KiiGroupAPI.prototype.getGroups = function (user, query, callback) {
            var _this = this;
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/groups?' + query + '=' + user.getId();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('GET');
            client.setKiiHeader(c, true);
            var respArray;
            client.send({
                onReceive: function (status, headers, body) {
                    var respGroups = body['groups'];
                    var result = new Array();
                    respGroups.forEach(function (item) {
                        result.push(_this.toKiiGroup(item));
                    });
                    if (callback === undefined) {
                        respArray = result;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(result);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respArray;
        };
        KiiGroupAPI.prototype.toKiiGroup = function (item) {
            var id = item['groupID'];
            var name = item['name'];
            var ownerId = item['owner'];
            var group = new Kii.KiiGroup(id);
            group.name = name;
            return group;
        };
        KiiGroupAPI.prototype.addMember = function (group, user, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                group.getPath() +
                '/members/' + user.id;
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setKiiHeader(c, true);
            var respGroup;
            client.send({
                onReceive: function (status, headers, body) {
                    group.members.push(user);
                    if (callback === undefined) {
                        respGroup = group;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(group);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respGroup;
        };
        KiiGroupAPI.prototype.removeMember = function (group, user, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                group.getPath() +
                '/members/' + user.id;
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('DELETE');
            client.setKiiHeader(c, true);
            var respGroup;
            client.send({
                onReceive: function (status, headers, body) {
                    group.removeMember(user);
                    if (callback === undefined) {
                        respGroup = group;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(group);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respGroup;
        };
        KiiGroupAPI.prototype.fetchMembers = function (group, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                group.getPath() +
                '/members';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('GET');
            client.setKiiHeader(c, true);
            var respArray;
            client.send({
                onReceive: function (status, headers, body) {
                    var array = body['members'];
                    var list = new Array();
                    array.forEach(function (item) {
                        var id = item['userID'];
                        list.push(new Kii.KiiUser(id));
                    });
                    if (callback === undefined) {
                        respArray = list;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(list);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respArray;
        };
        return KiiGroupAPI;
    })();
    Kii.KiiGroupAPI = KiiGroupAPI;
})(Kii || (Kii = {}));
/// <reference path="../KiiContext.ts" />
/// <reference path="../AppAPI.ts" />
/// <reference path="../KiiBucket.ts" />
/// <reference path="../QueryParams.ts" />
/// <reference path="../KiiObject.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpClientCallback.ts" />
/// <reference path="../BucketAPI.ts" />

(function (Kii) {
    var KiiBucketAPI = (function () {
        function KiiBucketAPI(context) {
            this.context = context;
        }
        KiiBucketAPI.prototype.query = function (bucket, params, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                bucket.getPath() +
                '/query';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, true);
            client.setContentType('application/vnd.kii.QueryRequest+json');
            var resp;
            client.sendJson(params.toJson(), {
                onReceive: function (status, headers, body) {
                    var nextPaginationKey = body['nextPaginationKey'];
                    params.setPaginationKey(nextPaginationKey);
                    var respArray = body['results'];
                    var result = new Array();
                    for (var i = 0; i < respArray.length; ++i) {
                        var item = respArray[i];
                        var id = item['_id'];
                        result.push(new Kii.KiiObject(bucket, id, item));
                    }
                    ;
                    if (callback === undefined) {
                        resp = {
                            results: result,
                            params: params
                        };
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(result, params);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return resp;
        };
        return KiiBucketAPI;
    })();
    Kii.KiiBucketAPI = KiiBucketAPI;
})(Kii || (Kii = {}));
/// <reference path="../KiiContext.ts" />
/// <reference path="../AppAPI.ts" />
/// <reference path="../KiiBucket.ts" />
/// <reference path="../KiiObject.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpClientCallback.ts" />
/// <reference path="../ObjectAPI.ts" />

(function (Kii) {
    var KiiObjectAPI = (function () {
        function KiiObjectAPI(context) {
            this.context = context;
        }
        KiiObjectAPI.prototype.create = function (bucket, data, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                bucket.getPath() +
                '/objects';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, true);
            client.setContentType('application/json');
            var respObject;
            client.sendJson(data, {
                onReceive: function (status, headers, body) {
                    var id = body['objectID'];
                    if (callback === undefined) {
                        respObject = new Kii.KiiObject(bucket, id, data);
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(new Kii.KiiObject(bucket, id, data));
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respObject;
        };
        KiiObjectAPI.prototype.getById = function (bucket, id, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                bucket.getPath() +
                '/objects/' + id;
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('GET');
            client.setKiiHeader(c, true);
            var respObject;
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        respObject = new Kii.KiiObject(bucket, id, body);
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(new Kii.KiiObject(bucket, id, body));
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respObject;
        };
        KiiObjectAPI.prototype.update = function (obj, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                obj.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setKiiHeader(c, true);
            client.setContentType('application/json');
            var respObject;
            client.sendJson(obj.data, {
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        respObject = obj;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(obj);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respObject;
        };
        KiiObjectAPI.prototype.updatePatch = function (obj, patch, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                obj.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, true);
            client.setHeader('X-HTTP-Method-Override', 'PATCH');
            client.setContentType('application/json');
            var respObject;
            client.sendJson(patch, {
                onReceive: function (status, headers, body) {
                    // apply patch
                    for (var k in patch) {
                        obj.data[k] = patch[k];
                    }
                    if (callback === undefined) {
                        respObject = obj;
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(obj);
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respObject;
        };
        KiiObjectAPI.prototype.deleteObject = function (obj, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                obj.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('DELETE');
            client.setKiiHeader(c, true);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        return KiiObjectAPI;
    })();
    Kii.KiiObjectAPI = KiiObjectAPI;
})(Kii || (Kii = {}));
/// <reference path="../KiiContext.ts" />
/// <reference path="../KiiTopic.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpClientCallback.ts" />
/// <reference path="../TopicAPI.ts" />

(function (Kii) {
    var KiiTopicAPI = (function () {
        function KiiTopicAPI(context) {
            this.context = context;
        }
        KiiTopicAPI.prototype.create = function (topic, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                topic.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('PUT');
            client.setKiiHeader(c, true);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        KiiTopicAPI.prototype.sendMessage = function (topic, message, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                topic.getPath() +
                '/push/messages';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setContentType('application/vnd.kii.SendPushMessageRequest+json');
            client.setKiiHeader(c, true);
            client.sendJson(message.toJson(), {
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        return KiiTopicAPI;
    })();
    Kii.KiiTopicAPI = KiiTopicAPI;
})(Kii || (Kii = {}));
/// <reference path="../KiiContext.ts" />
/// <reference path="../AppAPI.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpClientCallback.ts" />
/// <reference path="../ACLAPI.ts" />

(function (Kii) {
    var KiiACLAPI = (function () {
        function KiiACLAPI(context) {
            this.context = context;
        }
        KiiACLAPI.prototype.grant = function (target, verb, subject, callback) {
            this.exec('PUT', target, verb, subject, callback);
        };
        KiiACLAPI.prototype.revoke = function (target, verb, subject, callback) {
            this.exec('DELETE', target, verb, subject, callback);
        };
        KiiACLAPI.prototype.exec = function (method, target, verb, subject, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                target.getPath() +
                '/acl/' + verb +
                '/' + subject.getSubject();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod(method);
            client.setKiiHeader(c, true);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        return KiiACLAPI;
    })();
    Kii.KiiACLAPI = KiiACLAPI;
})(Kii || (Kii = {}));
/// <reference path="../AppAPI.ts" />
/// <reference path="../ObjectAPI.ts" />
/// <reference path="../KiiContext.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpClientCallback.ts" />
/// <reference path="KiiUserAPI.ts" />
/// <reference path="KiiGroupAPI.ts" />
/// <reference path="KiiBucketAPI.ts" />
/// <reference path="KiiObjectAPI.ts" />
/// <reference path="KiiTopicAPI.ts" />
/// <reference path="KiiACLAPI.ts" />

(function (Kii) {
    var KiiAppAPI = (function () {
        function KiiAppAPI(context) {
            this.context = context;
            this.userAPI_ = new Kii.KiiUserAPI(context);
            this.groupAPI_ = new Kii.KiiGroupAPI(context);
            this.bucketAPI_ = new Kii.KiiBucketAPI(context);
            this.objectAPI_ = new Kii.KiiObjectAPI(context);
            this.aclAPI_ = new Kii.KiiACLAPI(context);
            this.topicAPI_ = new Kii.KiiTopicAPI(context);
        }
        KiiAppAPI.prototype.login = function (userIdentifier, password, callback) {
            var body = {
                'username': userIdentifier,
                'password': password };
            if (callback === undefined) {
                return this.execLogin(body);
            }
            else {
                this.execLogin(body, callback);
            }
        };
        KiiAppAPI.prototype.loginWithLocalPhone = function (phone, country, password, callback) {
            var body = {
                'username': 'PHONE:' + country + '-' + phone,
                'password': password };
            if (callback === undefined) {
                return this.execLogin(body);
            }
            else {
                this.execLogin(body, callback);
            }
        };
        KiiAppAPI.prototype.loginAsAdmin = function (clientId, clientSecret, callback) {
            var body = {
                'client_id': clientId,
                'client_secret': clientSecret };
            if (callback === undefined) {
                return this.execLogin(body);
            }
            else {
                this.execLogin(body, callback);
            }
        };
        KiiAppAPI.prototype.execLogin = function (body, callback) {
            var _this = this;
            var c = this.context;
            var url = c.getServerUrl() + '/oauth2/token';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, false);
            client.setContentType('application/json');
            var respUser;
            var resp = client.sendJson(body, {
                onReceive: function (status, headers, body) {
                    var accessToken = body['access_token'];
                    var id = body['id'];
                    _this.context.setAccessToken(accessToken);
                    if (callback === undefined) {
                        respUser = new Kii.KiiUser(id);
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(new Kii.KiiUser(id));
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respUser;
        };
        KiiAppAPI.prototype.signUp = function (info, password, callback) {
            info['password'] = password;
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/users';
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setKiiHeader(c, false);
            client.setContentType('application/json');
            var respUser;
            var resp = client.sendJson(info, {
                onReceive: function (status, headers, body) {
                    var id = body['userID'];
                    if (callback === undefined) {
                        respUser = new Kii.KiiUser(id);
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success(new Kii.KiiUser(id));
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
            return respUser;
        };
        KiiAppAPI.prototype.deleteUser = function (user, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                user.getPath();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('DELETE');
            client.setKiiHeader(c, true);
            client.send({
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        KiiAppAPI.prototype.sendEvent = function (event, callback) {
            var c = this.context;
            var url = c.getServerUrl() +
                '/apps/' + c.getAppId() +
                '/events';
            event.data['_deviceID'] = c.getDeviceId();
            event.data['_uploadedAt'] = new Date().getTime();
            var client = c.getNewClient();
            client.setUrl(url);
            client.setMethod('POST');
            client.setContentType('application/vnd.kii.Event+json');
            client.setKiiHeader(c, false);
            client.sendJson(event.data, {
                onReceive: function (status, headers, body) {
                    if (callback === undefined) {
                        return;
                    }
                    if (callback.success === undefined) {
                        return;
                    }
                    callback.success();
                },
                onError: function (status, body) {
                    if (callback === undefined) {
                        throw new Error(body);
                        return;
                    }
                    if (callback.error === undefined) {
                        return;
                    }
                    callback.error(status, body);
                }
            });
        };
        // APIs
        KiiAppAPI.prototype.userAPI = function () {
            return this.userAPI_;
        };
        KiiAppAPI.prototype.groupAPI = function () {
            return this.groupAPI_;
        };
        KiiAppAPI.prototype.bucketAPI = function () {
            return this.bucketAPI_;
        };
        KiiAppAPI.prototype.objectAPI = function () {
            return this.objectAPI_;
        };
        KiiAppAPI.prototype.aclAPI = function () {
            return this.aclAPI_;
        };
        KiiAppAPI.prototype.topicAPI = function () {
            return this.topicAPI_;
        };
        return KiiAppAPI;
    })();
    Kii.KiiAppAPI = KiiAppAPI;
})(Kii || (Kii = {}));
if (typeof module != 'undefined' && module.exports) {
  module.exports = Kii;
}
