export default class CommunicationController {
    static BASE_URL = `https://develop.ewlab.di.unimi.it/mc/mostri/`

    static async genericRequest(endpoint, verb, queryParams = {}, bodyParams = {}) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString()
        const url = `${this.BASE_URL}${endpoint}${!queryParamsFormatted ? '' : '?' + queryParamsFormatted}`
        //console.log(`[CommunicationController] Request ${verb} to ${url} ...`);

        let fetchData = {method: verb, headers: {Accept: 'application/json', 'Content-Type': 'application/json'}}

        if (verb !== 'GET') fetchData.body = JSON.stringify(bodyParams)

        let httpResponse = await fetch(url, fetchData)

        const status = httpResponse.status
        if (status === 200) {
            //console.log(`[CommunicationController] Request ${verb} to ${url} successful`);
            return await httpResponse.json()
        } else {
            const message = await httpResponse.text()
            console.error(`[CommunicationController] Request ${verb} to ${url} not successful with error code ${message} `)
            throw new Error(status + ", " + message)
        }
    }

    static async newSession() {
        return await CommunicationController.genericRequest(
            'users',
            'POST'
        )
    }

    static async nearbyObjects(sid, lat, lon) {
        return await CommunicationController.genericRequest(
            'objects',
            'GET',
            {sid: sid, lat: lat, lon: lon}
        )
    }

    static async objectInformation(sid, id) {
        return await CommunicationController.genericRequest(
            `objects/${id}/`,
            'GET',
            {sid}
        )
    }

    static async activateObject(sid, id) {
        return await CommunicationController.genericRequest(
            `objects/${id}/activate`,
            'POST',
            {},
            {sid: sid}
        )
    }

    static async nearbyUsers(sid, lat, lon) {
        return await CommunicationController.genericRequest(
            'users',
            'GET',
            {sid: sid, lat: lat, lon: lon}
        )
    }

    static async userInformation(sid, id) {
        return await CommunicationController.genericRequest(
            `users/${id}`,
            'GET',
            {sid: sid}
        )
    }

    static async updateUser(sid, id, name, positionshare, picture) {
        return await CommunicationController.genericRequest(
            `users/${id}`,
            'PATCH',
            {},
            {sid: sid, name: name, positionshare: positionshare, picture: picture}
        )
    }

    static async ranking(sid) {
        return await CommunicationController.genericRequest(
            'ranking/',
            'GET',
            {sid: sid}
        )
    }
}