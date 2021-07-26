#!/bin/bash

DOMAIN=$1
WWWIP=$2
FILE=/var/lib/bind/$DOMAIN.hosts

sudo ./zone-creator.sh $DOMAIN $WWWIP > $FILE

if [ ! -f $FILE ];then
echo "Adding zone to named.conf.local"
echo -e "zone $DOMAIN {
     type master;
     file \"$FILE\";
};

" >> /etc/bind/named.conf.local

chown bind:bind /var/lib/bind/$DOMAIN.hosts
fi