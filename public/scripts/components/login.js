export default class Login {
    init(el) {
        el.innerHTML = `
			<p>Please Sign In To Continue</p>
			<button id="btn-signin" type="button" class="btn btn-success">Sign In</button>
        `;

        $('#btn-signin').on('click', function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider);
        });
    }
}
