#!/bin/bash

CUR_DIR=`pwd`
DOMAIN=$1
WWWIP=$2
FILE=/var/lib/bind/$DOMAIN.hosts

if [ ! -f $FILE ];then
echo "Adding zone to named.conf.local"
echo -e "zone \"$DOMAIN\" {
     type master;
     file \"$FILE\";
};

" >> /etc/bind/named.conf.local

chown bind:bind /var/lib/bind/$DOMAIN.hosts
fi