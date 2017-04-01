(()=>{
    const FESTIVAL  = 'festivals';
    const WRESTLING = 'sports';
    const SPORTS = 'sports';
    const EVENTS = 'events';
    const ART       = 'art';
    
    module.exports = {
        events:[
            {
                name: 'Festival International',
                type: [FESTIVAL, EVENTS].join(' '),
                startDate: 'April 26, 2017',
                endDate: 'April 30, 2017',
                website: 'www.festivalinternational.org',
                details: 'The Festival International de Louisiane is an annual music and arts festival held in Lafayette, \
                Louisiana celebrating the French heritage of the region and its connection to the Francophone world.',
                location: 'Downtown Lafayette, LA'
            },
            {
                name: 'Festivals Acadien Et Créoles',
                type: [FESTIVAL, EVENTS].join(' '),
                startDate: 'October 12, 2017',
                endDate: 'October 15, 2017',
                website: 'www.festivalsacadiens.com/',
                details: 'Lafayette, LA’s annual Festivals Acadiens et Créoles, held the second full weekend in October, \
                provides the ideal opportunity to discover Lafayette, LA’s blend of food, music and culture that makes the city so unique.',
                location: 'Girard Park Lafayette, LA'
            },
            {
                name: 'WWE Raw',
                type: [WRESTLING, EVENTS].join(' '),
                startDate: 'June 12, 2017 18:30:00',
                endDate: 'October 15, 2017',
                details: 'Monday Night RAW',
                location: 'Cajun Dome Lafayette, LA'
            },
            {
                name: 'Art Walk',
                type: [ART, EVENTS].join(' '),
                startDate: 'March 11, 2017',
                endDate: 'March 11, 2017',
                details: 'During 2nd Saturday ArtWalk, Downtown comes alive as each independent gallery, studio and art house\
                opens their doors for this free event. Art aficionados and casual patrons alike will leave inspired as they explore the Downtown Lafayette Cultural District.',
                location: 'Downtown Lafayette, LA'
            },
            {
                name: 'Hope Fest',
                type: [FESTIVAL, EVENTS].join(' '),
                startDate: 'April 8, 2017',
                endDate: 'April 8, 2017',
                details: 'Hopefest is a unique festival, led by teens and supported by hundreds of local businesses. Hopefest has raised over $500,000 for local charities and\
                seen over 1,000 teenagers volunteer to help those most in need in our community.  Proceeds of Hopefest this year will support special needs teens through the STM\
                Options Program and the Boys and Girls Club of Acadiana. Purchase tickets now for a pre-event price of $15. Tickets on sale at gate are $25.',
                location: 'Parc International Lafayette, LA'
            },
            {
                name: 'Downtown Alive',
                type: [ART, EVENTS].join(' '),
                startDate: 'Friday April 7, 2017',
                endDate: 'April 7, 2017',
                website: 'http://www.downtownlafayette.org/events/downtown-alive.html',
                details: 'Everyone’s favorite Friday night party is back with an all-local lineup! Now you don’t have to choose between DTA! and boiled crawfish on Friday nights\
                since Downtown’s newest seafood restaurant, Hook & Boil will be serving hot, boiled crawfish every Friday night at DTA!',
                location: 'Downtown Lafayette, LA'
            },
            {
                name: 'UL Baseball vs. South Alabama',
                type: [SPORTS, EVENTS].join(' '),
                startDate: 'April 1, 2017',
                endDate: 'April 1, 2017',
                website: 'www.ragincajuns.com',
                details: 'Come out and support Louisiana’s Ragin’ Cajun’s Baseball team as they take on the University of South Alabama Jaguars!',
                location: 'M.L. "Tigue" Moore Field at Russo Park Lafayette, LA'
            },
            {
                name: 'UL Softball vs. Troy',
                type: [SPORTS, EVENTS].join(' '),
                startDate: 'April 8, 2017',
                endDate: 'April 8, 2017',
                website: 'www.ragincajuns.com',
                details: 'Double Header first game @2PM.',
                location: 'Lamson Park Lafayette, LA'
            }
        ]
    };
})();