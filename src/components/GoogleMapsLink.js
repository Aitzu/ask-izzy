/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";
import classnames from "classnames";

type Props = {
    to: Location,
    children?: any,
    className: ?string,
}

class GoogleMapsLink extends React.Component<Props, void> {
    static sampleProps = {
        default: {
            children: (
                <div>Link text</div>
            ),
            to: new Location(fixtures.ixa.location),
        },
    };

    googleMapsUrl(): string {
        const toAddr = this.props.to;
        const {travelTime} = toAddr;
        const mode = travelTime && travelTime.mode == "TRANSIT" ? "r" : "w";
        const start = encodeURIComponent("Current Location");
        let queryFields = [
            toAddr.flat_unit,
            toAddr.street_number,
            toAddr.street_name,
            toAddr.street_type,
            toAddr.street_suffix,
            toAddr.suburb,
            toAddr.state,
            toAddr.postcode,
        ]

        if (toAddr.isSuburbOnly()) {
            queryFields = [
                toAddr.suburb,
                toAddr.state,
                toAddr.postcode,
            ]
        }
        const query = encodeURIComponent(
            queryFields
                .join(" ")
                .trim()
        );

        return `https://maps.google.com/?dirflg=${mode
        }&saddr=${start
        }&daddr=${query}`;
    }

    render() {
        const {
            className,
            children,
        } = this.props;

        if (this.props.to.isConfidential()) {
            return (
                <span
                    className={classnames("GoogleMapsLink", className)}
                >
                    {children}
                </span>
            );
        }

        return (
            <a
                className={classnames("GoogleMapsLink", className)}
                target="_blank"
                aria-label="Open Google Maps in a new tab"
                href={this.googleMapsUrl()}
            >
                {children}
            </a>
        );
    }
}

export default GoogleMapsLink;
