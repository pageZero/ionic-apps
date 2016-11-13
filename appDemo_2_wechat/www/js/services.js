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
        handleMessageDate: function(message) {
            return null;
        },
        //获取消息的时间
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
                console.log(messageDate);
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
            }
        }
    }])