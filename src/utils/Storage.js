import {storage, db} from '../../firebase'

export const uploadImage = async (user, type, file, uid) => {
    const ref = storage.ref()
    const response = await fetch(file);
    const blob = await response.blob();
    const metadata = {
        contentType:'image/jpg'
    }

    ref.child(`${user}/${type}/`+file).put(blob, metadata).then(data => {
        if(type === 'header'){
            storage.ref(`${user}/header/${file}`).getDownloadURL()
            .then(res => {
                db.collection('users').doc(uid).update({
                    photoHeader: res,
                })
            })
        }
        if(type === 'profilePic'){
            storage.ref(`${user}/profilePic/${file}`).getDownloadURL()
            .then(res => {
                db.collection('users').doc(uid).update({
                    photoProfile: res,
                })
            })
        }
    })
} 
