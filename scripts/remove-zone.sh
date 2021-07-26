#!/bin/sh

# ./removezone.sh yourdomain.com
rootdir="/etc/bind"
zonedir="/var/lib/bind"
conf="named.conf.local"
zone=$1
sudo sed -e "/^zone \"$zone\" {/,/^};$/ d" -i $rootdir/$conf
sudo rm $zonedir/$zone.hosts