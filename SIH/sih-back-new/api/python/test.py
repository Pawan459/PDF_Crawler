import sys
import psycopg2
import json
import re
import smtplib
import requests

ENV = "dev"  # dev||production
regex = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)

ids = sys.argv[2].split(',')
uid = sys.argv[1]

def send_email(user, pwd, recipient, subject, body):
    FROM = user
    TO = recipient
    SUBJECT = "You Got An Update!!!"
    TEXT = "Please visit the website xyz.com and click on "

    # Prepare actual message
    message = (s for s in body)+ "From: %s\nTo: %s\nSubject: %s\n\n%s " % (FROM, ", ".join(TO), SUBJECT, TEXT)
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login(user, pwd)
        server.sendmail(FROM, TO, message)
        server.close()
        print ('successfully sent the mail')
    except:
        print ("failed to send mail")

def msg_api(number, msg):
    numberss=number
    messagess="msg"
    url = 'https://www.fast2sms.com/dev/bulk'
    querystring = {"authorization":"EH5dVGgbRawlzFyhXAurHG1gI2o542gTorVbJ2oqqB0NqzrWpICHlxbARKDr",
               "sender_id":"FSTSMS",
               "message":messagess,
               "language":"english",
               "route":"p",
               "numbers":numberss}

    headers = {
        'cache-control': "no-cache"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    if response.status_code==200:
        print("Message Sent Successfully")
    else:
        print("Message Not Sent Try again")

def url_tag_ext(url):
    from bs4 import BeautifulSoup
 
    #url = 'http://mospi.gov.in/'
    link2 = []    
    value = []
    source = requests.get(url).text.encode('utf8')
    #print(url)
    base_link = re.findall(".*?.?[ac|gov|nic].in/", url)
    #print(base_link)
    base_url = ''.join(base_link)
    #print(base_url)
    soup = BeautifulSoup(source, 'lxml')
    data = soup.find_all('a')
    k = []
    for item in data:
        t = []
        t = str(item).split('">')
        k.append(t)

    links = []
    for i in k:
        if(len(re.findall('.*[.]pdf',str(i[0])))>0):
            link = re.findall('[http|/].*[.]pdf',str(i[0]))
            if(len(link)>0):
                link=''.join(link)
                kos = link[6:]
                links.append(kos)
                if(len(i) == 2):
                    value.append(str(i[1][:-4]))
        
    for link in links:
        if(link.startswith('http')):
            link2.append(link)
        else:
            if(link[0] == '/'):
                res = base_url + link[1:]
                link2.append(res)
            else:
                res = base_url + link[1:]
                link2.append(res)
    return link2,value

with open('config.json', 'r') as f:
    config = json.load(f)

try:
    con = psycopg2.connect(database=config[ENV]["db"], user=config[ENV]["dbuser"], password=config[ENV]["dbpass"],
                           host=config[ENV]["dbhost"], port=config[ENV]["dbport"])
    cur = con.cursor()   
    for id in ids:
        try:
            cur.execute("select url from \"urlsToScrape\" where id = %s limit 1", (id,))
            url = cur.fetchall()
            url = url[0][0]
            print("Extracting for url ", url)
            links,texts= url_tag_ext(url)
            links = ', '.join(links).encode('utf8').decode('utf8', 'ignore').split(', ')
            texts = ', '.join(texts).encode('utf8').decode('utf8', 'ignore').split(', ')
            i = -1
            for l in links:
                i = i +1
                print("checking link", l)
                if(re.match(regex, l) == False):
                    continue
                try:
                    print("inserting link", l)
                    cur.execute("insert into reports(\"extractedFrom\", url, linktext, \"tokens\") VALUES(%s,%s,%s,to_tsvector(%s))", (id,l,texts[i],texts[i]))
                    con.commit()
                except Exception as er:
                    print("possible duplication")
                finally:
                    con.commit()    
        except Exception as e:
            print("Some error occured!")
            print(e) 
    cur.execute("select email,phone_no from users where id = %s limit 1", (uid,))
    udata = cur.fetchall()
    udata = udata[0]
    print(udata)
    #send_email("shivamrajput199@gmail.com", 'Smoke12@#$%&&', udata[0], "You Got An Update!!!", "Check  site!")
    #msg_api(udata[1], "Please visit the site or mail to check for updates")

except Exception as e:
    print("Cant connect to db")
    print(e)
finally:
    con.close()
