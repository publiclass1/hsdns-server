#!/bin/sh

# ./removezone.sh yourdomain.com
rootdir="/etc/bind"
zonedir="/var/lib/bind"
conf="*.conf"
zone=$1
sed -e "/^zone \"$zone\" {/,/^};$/ d" -i $rootdir/$conf
rm $zonedir/$zone.hosts