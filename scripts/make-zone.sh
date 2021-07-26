#!/bin/bash

DOMAIN=$1
FILE=/var/lib/bind/$DOMAIN.hosts

echo "Adding zone to named.conf.local"
echo -e "zone \"$DOMAIN\" {
     type master;
     file \"$FILE\";
};
" >> /etc/bind/named.conf.local