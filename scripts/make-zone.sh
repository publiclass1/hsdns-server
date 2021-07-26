#!/bin/bash

CUR_DIR=`pwd`
DOMAIN=$1
WWWIP=$2
FILE=/var/lib/bind/$DOMAIN.hosts
$CUR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if [ ! -f $FILE ];then

sudo bash $CUR_DIR/zone-creator.sh $DOMAIN $WWWIP > $FILE
echo "Adding zone to named.conf.local"
echo -e "zone \"$DOMAIN\" {
     type master;
     file \"$FILE\";
};

" >> /etc/bind/named.conf.local

chown bind:bind /var/lib/bind/$DOMAIN.hosts
fi