db.redirects.update({previous:{$exists:1}},{$rename:{'previous':'url'}},{multi: true})
db.redirects.update({current:{$exists:1}},{$rename:{'current':'to'}},{multi: true})
