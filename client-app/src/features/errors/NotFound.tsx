import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function Notfound(){
    return(
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Oops-we've looked everywhere and could not found this.
            </Header>
            <Segment.Inline>
                <Button as={Link} to = '/activities' primary>
                    Return to activities page
                </Button>
            </Segment.Inline>
        </Segment>
    )
}