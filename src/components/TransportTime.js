/* @flow */

import React from "react";
import classnames from "classnames";
import { titleize } from "underscore.string";

import fixtures from "../../fixtures/services";
import icons from "../icons";
import Location from "../iss/Location";
import sendEvent from "../google-tag-manager";

class TransportTime extends React.Component {
    props: {
        location: Location,
        compact?: true,
    };
    state: void;

    static defaultProps = {
        compact: false,
    };

    constructor() {
        super();
    }

    static sampleProps = {
        compact: {
            location: new Location(fixtures.ixa.location, {
                mode: "WALK",
                duration: {text: "15 minutes", value: 1},
                distance: {text: "", value: 1},
                status: "",
            }),
            compact: true,
        },
        expanded: {
            location: new Location(fixtures.ixa.location, {
                mode: "TRANSIT",
                duration: {text: "15 minutes", value: 1},
                distance: {text: "", value: 1},
                status: "",
            }),
            compact: false,
        },
    };

    render() {
        if (!this.props.location.isConfidential()) {
            return this.renderPublic()
        } else {
            return null;
        }
    }

    renderPublic() {
        const {travelTime} = this.props.location;

        if (!travelTime) {
            return <div />;
        }

        return (
            <div>
                {this.renderDivider()}
                <div
                    className={classnames(
                        "TransportTime",
                        {compact: this.props.compact}
                    )}
                >
                    {this.renderTravelTimes(travelTime)}
                    {this.renderSuburb()}
                    {this.renderDirections()}
                </div>
            </div>
        );
    }

    renderTravelTimes(travelTimes: Object) {

        return travelTimes.map((travel, key) => {
            let icon = '';

            if (travel.mode === "TRANSIT") {
                icon = (<icons.Tram
                    className="ColoredIcon"
                    aria-label="By public transport"
                        />);
            } else if (travel.mode === "DRIVING") {
                icon = (<icons.Phone
                    className="ColoredIcon"
                    aria-label="By car"
                        />);
            } else {
                icon = (<icons.Walk
                    className="ColoredIcon"
                    aria-label="On foot"
                        />);
            }

            return (
                <div className="travel-time">
                    {icon}
                    {
                        travel &&
                        travel.duration &&
                        travel.duration.text
                    }
                </div>
            );

        });

    }

    renderDivider() {
        if (!this.props.compact) {
            return (
                <hr/>
            );
        } else {
            return null;
        }
    }

    recordClick(): void {
        const {location} = this.props;

        sendEvent({
            event: "clickGetDirections",
            addressLine1: location.streetAddressLine1(),
            addressLine2: location.streetAddressLine2(),
        });
    }

    renderDirections() {
        if (!this.props.compact) {
            return (
                <div
                    className="getDirections"
                    onClick={this.recordClick.bind(this)}
                >
                    Get directions
                </div>
            );
        }
        return <span />;
    }

    renderSuburb() {
        return (
            <span className="location">
                {titleize(this.props.location.suburb)}
            </span>
        );
    }
}

export default TransportTime;
