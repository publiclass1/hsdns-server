#!/bin/bash

DOMAIN=$1
WWWIP=$2

./zone-creator.sh $DOMAIN $WWWIP > /var/lib/bind/$DOMAIN.hosts

echo "Adding zone to named.conf.local"
echo -e "zone $DOMAIN {
     type master;
     file \"/var/lib/bind/$DOMAIN.hosts\";
};

" >> /etc/bind/named.conf.local
