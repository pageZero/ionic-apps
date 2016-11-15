//定义服务

angular.module('wechat.services',[])

.factory("userService", function($http) {
    var users = [];
    return {
        getUsers : function() {
            return $http.get("https://randomuser.me/api/?results=10").then(function(response) {
                users = response.data.results;
                return response.data.results;
            });
        },
        getUser : function(index) {
            return users[index];
        }
    };
})

.factory('localStorageService', [function() {
    return {
        get : function localStorageServiceGet(key, defaultValue) {
            var stored = localStorage.getItem(key);
            try {
                stored = angular.fromJson(stored);
            } catch (error) {
                stored = null;
            }
            if (defaultValue && stored === null) {
                stored = defaultValue;
            }
            return stored;
        },
        update: function localStorageServiceUpdate(key, value) {
            if (value) {
                localStorage.setItem(key, angular.toJson(value));
            }
        },
        remove: function localStorageServiceRemove(key) {
            localStorage.removeItem(key);
        }
    };
}])

.factory('dateService', [function() {
    return {
        //处理所有Message的显示时间
        handleMessageDate: function(messages) {
            var i = 0,
                length = 0,
                messageDate = {},
                nowDate = {},
                weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                diffWeekValue = 0;
                if(messages) {
                    //获取当前的时间
                    nowDate = this.getNowDate();
                    length = messages.length;
                    for(; i < length; i++) {
                        messageDate = this.getMessageDate(messages[i]);
                        if(!messageDate) {
                            return null;
                        }
                        /* 如果当前时间和最近消息时间相隔超过一年
                         * 就显示年份
                         */
                        if(nowDate.year - messageDate.year > 0) {
                            messages[i].lastMessage.time = messageDate.year + "";
                            continue;
                        }
                        /*如果当前时间和最近消息时间同属于一年
                        * 就显示几月几日
                        */
                        if(nowDate.month - messageDate.month >= 0 ||
                            nowDate.day - messageDate.day > nowDate.week) {
                            messages[i].lastMessage.time = messageDate.month + 
                                "月" + messageDate.day + "日";
                            continue;
                        }
                        //如果当前日期和最后消息的保存时间相隔不超过一个星期
                        //就计算应该显示的时间是周几
                        if (nowDate.day - messageDate.day <= nowDate.week &&
                            nowDate.day - messageDate.day > 1) {
                            diffWeekValue = nowDate.week - (nowDate.data - messageDate.day);
                            messages[i].lastMessage.time = weekArray[diffWeekValue];
                            continue;
                        }
                        /* 如果当前日期和最后消息的保存时间相隔一天
                         * 就显示昨天
                         */
                        if(nowDate.day - messageDate.day === 1) {
                            messages[i].lastMessage.time = "昨天";
                            continue;
                        }
                        /*如果当前日期和最后消息的保存时间同属于一天
                        * 就显示几点几分
                        */
                        if(nowDate.day - messageDate.day === 0) {
                            messages[i].lastMessage.time = messageDate.hour + ":" + messageDate.minute;
                            continue;
                        }
                    }//end for
                    console.log(messages);
                  //  return messages;
                } else {//传入的messages为空
                    console.log("messages is null");
                    return null;
                }
        },
        //获取当前的时间对象
        getNowDate: function() {
            var nowDate = {};
            var date = new Date();
            nowDate.year = date.getFullYear();
            nowDate.month = date.getMonth();
            nowDate.day = date.getDate();
            nowDate.week = date.getDay();
            nowDate.hour = date.getHours();
            nowDate.minute = date.getMinutes();
            nowDate.second = date.getSeconds();
            return nowDate;
        },
        //获取消息的时间，转为时间对象
        getMessageDate :function(message) {
            var messageDate = {};
            var messageTime = "";
            //2015-10-12 15:34:55
            var reg = /(^\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/g;
            var result = new Array();
            //传入的消息不为空，就返回消息的时间
            if(message) {
                messageTime = message.lastMessage.originalTime;
                //将字符串类型的时间转为数组
                result = reg.exec(messageTime);
                if(!result) {
                    console.log("message time is null");
                    return null;
                }
                //从保存的字符串类型的时间中获取到时间对象
                messageDate.year = parseInt(result[1]);
                messageDate.month = parseInt(result[2]);
                messageDate.day = parseInt(result[3]);
                messageDate.hour = parseInt(result[4]);
                messageDate.minute = parseInt(result[5]);
                messageDate.second = parseInt(result[6]);
                //console.log(messageDate);
                //返回时间对象
                return messageDate;
            } else {
                console.log("message is null");
                return null;
            }
        }
    }
}])

.factory('messageService', ['localStorageService', 'dateService',
    function(localStorageService, dateService) {
        return {
            //获取当前存储的messages，调整格式之后重新存储，便于之后获取
            //调整：根据消息最后一次修改的时间填写消息的缺失的时间信息
            //获取所有消息的id，然后单独存储messageID
            //按照message+id作为key的形式重新存储
            init: function(messages) {
                var i = 0;
                var length = 0;
                var messageID = new Array();
                var date = null;
                var messageDate = null;
                if (messages) {
                    length = messages.length;
                    for(; i < length; i++) {
                        messageDate = dateService.getMessageDate(messages[i]);
                        if(!messageDate) {
                            return null;
                        }
                        date = new Date(messageDate.year, messageDate.month,
                                messageDate.day, messageDate.hour, messageDate.minute,
                                messageDate.second);
                         messages[i].lastMessage.timeFrome1970 = date.getTime();
                         messageID[i] = {
                                id: messages[i].id
                            };
                    }
                    localStorageService.update("messageID", messageID);
                    for (i = 0; i < length; i++) {
                        localStorageService.update("message_" + messages[i].id, messages[i]);
                    }
                }
            },
            //获取存储的所有message
            getAllMessages: function() {
                var messages = new Array();
                var i = 0;
                //获取所有的messageid
                var messageIDs = localStorageService.get("messageID");
                var length = 0;
                var message = null;
                if(messageIDs) {
                    length = messageIDs.length;
                    for(; i < length; i++) {
                        message = localStorageService.get("message_"+messageIDs[i].id);
                        if(message){
                            messages.push(message);
                        }
                    }
                    dateService.handleMessageDate(messages);
                    return messages;
                }
                return null;
            },
            getMessageById: function(id) {
                return localStorageService.get("message_" + id);
            },
            
            /**
             * 根据给出的num和message的id，得到这个message下的num条子message
             */
            getAmountMessageById: function(num, id) {
                var messages = [];
                var message = localStorageService.get("message_" + id).message;
                var length = 0;
                if(num < 0 || !message) return;
                length = messages.length;
                if(num < length) {
                    messages = message.splice(length - num, length);
                    return messages;
                } else {
                    return message;
                }
            },
            updateMessage: function(message) {
                var id = 0;
                if(message) {
                    id = message.id;
                    localStorageService.update("message_" + id, message);
                }
            },
            deleteMessageId: function(id) {
                var messageIds = localStorageService.get("messageID");
                var length = 0;
                var  i = 0;
                if(!messageIds) {
                    return null;
                }
                length = messageIds.length;
                for(; i < length; i++) {
                    if(messageIds[i].id === id) {
                        //从messageIds中删除这个id
                        messageIds.splice(i,1);
                        break;
                    }
                }
                //更新本地存储
                localStorageService.update("messageID", messageIds);
            },
            //删除消息
            removeMessage: function(message) {
                var id = 0;
                if(message) {
                    id = message.id;
                    localStorageService.remove("message_"+ id);
                }
            }


        }
    }])