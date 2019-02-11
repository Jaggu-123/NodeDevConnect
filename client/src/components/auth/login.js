import React, { Component } from "react";
import classnames from "classnames";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.password
        };

        console.log(user);
    }

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="login">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 m-auto">
                                <h1 className="display-4 text-center">
                                    Log In
                                </h1>
                                <p className="lead text-center">
                                    Sign in to your DevConnector account
                                </p>
                                <form onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            className={classnames(
                                                "form-control form-control-lg",
                                                {
                                                    "is-invalid": errors.email
                                                }
                                            )}
                                            placeholder="Email Address"
                                            name="email"
                                            value={this.state.value}
                                            onChange={this.onChange}
                                        />
                                        {errors.email && (
                                            <div className="is-inValid">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className={classnames(
                                                "form-control form-control-lg",
                                                {
                                                    "is-invalid":
                                                        errors.password
                                                }
                                            )}
                                            placeholder="Password"
                                            name="password"
                                            value={this.state.value}
                                            onChange={this.onChange}
                                        />
                                        {errors.password && (
                                            <div className="is-inValid">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="submit"
                                        className="btn btn-info btn-block mt-4"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
