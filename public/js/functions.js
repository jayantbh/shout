/**
 * Created by Jayant Bhawal on 20-09-2015.
 */

var username;
var socket = io();
var timeout;
$(document).ready(function () {
    var name = prompt("What's your name?", "User" + Math.floor((Math.random() * 10000) + 1));
    socket.emit('new user', name);
    username = name;
});
$('form').submit(function (e) {
    e.preventDefault();
    console.log("Message: " + $('#m').val());
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    $('#m').focus();
    socket.emit('not typing', username);
});
$('form').keydown(function () {
    socket.emit('typing', username);
    clearTimeout(timeout);
    timeout = setTimeout(function () {
            socket.emit('not typing', username);
        },
        1000);
});
socket.on('not typing', function (name) {
    $("li[data-user='" + name + "']").remove();
});
socket.on('chat message', function (msg) {
    $("#messages").append("<li>" + msg + "</li>")
});
socket.on('system log', function (msg) {
    $("#messages").append("<li><b>" + msg + "</b></li>")
});
socket.on('system event', function (name) {
    if (!$("li[data-user='" + name + "']").length && name != username)
        $("#typing").append("<li data-user='" + name + "'><b>" + name + " is typing...</b></li>")
});
