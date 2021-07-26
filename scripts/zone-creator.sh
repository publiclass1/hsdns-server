#!/bin/bash
# A Bash shell script to create BIND ZONE FILE.
# Tested under BIND 8.x / 9.x, RHEL, DEBIAN, Fedora Linux.
# -------------------------------------------------------------------------
# Copyright (c) 2002,2009 Vivek Gite <vivek@nixcraft.com>
# This script is licensed under GNU GPL version 2.0 or above
# -------------------------------------------------------------------------
# This script is part of nixCraft shell script collection (NSSC)
# Visit http://bash.cyberciti.biz/ for more information.
# -------------------------------------------------------------------------
# Examples:
# ./mkzone.sh example.com default-www-IP-address
# ./mkzone.sh cyberciti.biz 74.12.5.1

TTL="3h"                     		 # Default TTL
ATTL="3600"		                	 # Default TTL for each DNS rec	
EMAILID="paulbaker.testnames.link"   # hostmaster email
REFRESH="3h"                  		 # Refresh After 3 hours
RETRY="1h"                    	     # Retry Retry after 1 hour
EXPIER="2w"		                	 # Expire after 1 week
MAXNEGTIVE="1h"		            	 # Minimum negative caching of 1 hour	
 
DOMAIN="$1"
WWWIP="$2"
 
if [ $# -le 1 ]
then
	echo "Syntax: $(basename $0) domainname www.domain.ip.address [profile]"
	echo "$(basename $0) example.com 1.2.3.4"
	exit 1
fi
 
SERIAL=$(date +"%Y%m%d")01                     # Serial yyyymmddnn
 

# set default ns1
NAMESERVERS=("ns1.testnames.link" "ns2.testnames.link")
NS1=${NAMESERVERS[0]}
 
###### start SOA ######
echo "\$TTL ${TTL}"
echo "${DOMAIN}.	IN	SOA	${NS1}.	${EMAILID}.("
echo "			${SERIAL}	; Serial yyyymmddnn"
echo "			${REFRESH}		; Refresh After 3 hours"
echo "			${RETRY}		; Retry Retry after 1 hour"
echo "			${EXPIER}		; Expire after 1 week"
echo "			${MAXNEGTIVE})		; Minimum negative caching of 1 hour"
echo ""
###### start A pointers #######
# A Records - Default IP for domain 
echo "${DOMAIN}.			${ATTL}	IN 	A	${WWWIP}"
echo "www.${DOMAIN}.			${ATTL}	IN	CNAME	${DOMAIN}."
###### start Name servers #######
# Get length of an array
tLen=${#NAMESERVERS[@]}
 
# use for loop read all nameservers
for (( i=0; i<${tLen}; i++ ));
do
	echo "$DOMAIN.			${ATTL} IN NS  ${NAMESERVERS[$i]}."
done